import { Injectable } from '@angular/core';
import {AuthenticationService} from "./authentication.service";
import {Round} from "../models/round";
import {GameComponent} from "../../game/game.component";
import {Ship} from "../models/ship";
import {Decision} from "../models/decision";
import {Move} from "../models/move";

export class WSMessage {
  public type:string;
  public payload:string;
}

@Injectable()
export class WSService {

  private webSocket: WebSocket;

  constructor(private authenticationService: AuthenticationService) { }

  connectToGame(gameId, gameComponent) {

     this.webSocket = new WebSocket('ws://localhost:8080/websocket');

    this.webSocket.onmessage =  (event) => {

       let msg = JSON.parse(event.data);
      console.log(event.data, msg);

      switch (msg.type){
        case 'USERCONNECTED':
          console.log(msg.payload + ' connected.');
          break;

        case 'NEWROUND':

          //generate usable ship array from backend input (backend ship model differs from ours; here we create ships based on the data sent to us)
          let inputships = [null, null, null, null];
          for(let i = 0; i < 4; i++){
            inputships[i] = new Ship(i+1, msg.payload.ships[i].numFields);  //ID is needed, otherwise slots don't work
          }

          //create new round
          let newround = new Round(msg.payload.roundNumber, inputships, [null, null, null, null]);
          console.log(msg.payload.ships);
          console.log('new round created: ' + msg.payload.roundNumber);
          gameComponent.initRound(newround);
          break;

        case 'CURRENTTURN':
          //let game know whose turn it is
          console.log('It\'s ' + msg.payload + "'s turn.");
          //gameComponent.setCurrentPlayer(msg.payload);    //TODO add function for telling game component who is the current player
          break;


        case 'PLAYEDMOVE':
          //TODO do whatever the turn sent to us from the backend tells us to do
          console.log("The server tells us to do the following:")
          console.log(msg.payload);
          //TODO create a decision object based on backend information
          if(msg.payload.player != this.authenticationService.mySelf.username) //if this move is not from me, update:
          {
            let moveToDo = msg.payload.move;
            gameComponent.updateUiForOneMove2(moveToDo, msg.payload.player);
          }
          break;

      }

    }
    this.webSocket.onopen = (event) => {
      console.log("Socket is open", event);

      // Tell server we joined the mage
      var msg = {
        gameId: gameId,
        user: this.authenticationService.mySelf.username
      };

      this.webSocket.send(JSON.stringify(msg));
    }

  }
}
