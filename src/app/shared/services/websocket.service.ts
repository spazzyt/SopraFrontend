import { Injectable } from '@angular/core';
import {AuthenticationService} from "./authentication.service";
import {Round} from "../models/round";
import {GameComponent} from "../../game/game.component";

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

    this.webSocket.onmessage = function (event) {

       let msg = JSON.parse(event.data);
      console.log(event.data, msg);

      switch (msg.type){
        case 'USERCONNECTED':
          console.log(msg.payload + ' connected.');
          break;

        case 'NEWROUND':        //TODO adapt functionality to correct for changing backend input
          //create new round
          let newround = new Round(msg.payload.roundNumber, msg.payload.ships, [null, null, null, null]);
          console.log(msg.payload.ships);
          console.log('new round created: ' + msg.payload.roundNumber);
          gameComponent.initRound(newround);
          break;

        case 'CURRENTTURN':
          //let game know whose turn it is
          console.log('It\'s ' + msg.payload + "'s turn.");
          //gameComponent.setCurrentPlayer(msg.payload);    //TODO add function for telling game component who is the current player
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
