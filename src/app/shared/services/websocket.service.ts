import { Injectable } from '@angular/core';
import {AuthenticationService} from "./authentication.service";
import {Round} from "../models/round";
import {GameComponent} from "../../game/game.component";
import {Ship} from "../models/ship";
import {Decision} from "../models/decision";
import {Move} from "../models/move";
import { environment } from '../../../environments/environment';
import {MarketCard} from "../models/market-card";


export class WSMessage {
  public type:string;
  public payload:string;
}

@Injectable()
export class WSService {

  private webSocket: WebSocket;

  private apiUrl:string;

  constructor(private authenticationService: AuthenticationService) {

    this.apiUrl = environment.apiUrl;

  }

  connectToGame(gameId, gameComponent) {

     this.webSocket = new WebSocket(environment.wsProt + this.apiUrl +  '/websocket');

    this.webSocket.onmessage =  (event) => {

       let msg = JSON.parse(event.data);
      console.log(event.data, msg);

      switch (msg.type){

        //User joined game
        case 'USERCONNECTED':
          console.log(msg.payload + ' connected.');
          break;

        //Started new round
        case 'NEWROUND':

          //update player stones & quarry
          gameComponent.updateScoreSledQuarry(msg.payload.berlinerScore, msg.payload.sleds, msg.payload.quarries);


          //generate usable ship array from backend input (backend ship model differs from ours; here we create ships based on the data sent to us)
          let inputships = [null, null, null, null];
          for(let i = 0; i < 4; i++){
            inputships[i] = new Ship(msg.payload.ships[i].shipId, msg.payload.ships[i].numFields);  //ID is needed, otherwise slots don't work
          }

          let inputcards = [null, null, null, null];
          for(let j = 0; j < 4; j++){
            inputcards[j] = new MarketCard(msg.payload.marketCards[j].id, msg.payload.marketCards[j].type, msg.payload.marketCards[j].name);
          }

          //create new round object
          let newround = new Round(msg.payload.roundNumber, inputships, inputcards, msg.payload.berlinerScore);
          console.log(msg.payload.ships);
          console.log('new round created: ' + msg.payload.roundNumber);
          console.log(newround);
          gameComponent.initRound(newround);
          break;


        //End game & show scoreboard
        case 'ENDGAME':
          console.log("THE GAME HAS ENDED");
          gameComponent.endGame(msg.payload.finalScoreDumbArray);
          //TODO add end-game functionality for showing scoreboard (requires array of player names, array of scores)
          break;


        //Update currentActivePlayerField in game component
        case 'CURRENTTURN':
          //let game know whose turn it is
          console.log('It\'s ' + msg.payload + "'s turn.");
          console.log("my name is: ", gameComponent.game.myPlayerField, gameComponent.game.myUserName)
          gameComponent.setPlayerField(msg.payload);
          break;


        //Execute other player's move
        case 'PLAYEDMOVE':
          console.log("The server tells us to do the following:")
          console.log(msg.payload);
          if(msg.payload.player != this.authenticationService.mySelf.username) //if this move is not from me, update:
          {
            let moveToDo = msg.payload.move;
            gameComponent.updateUiForOneMove2(moveToDo, msg.payload.player, msg.payload.berlinerScore, msg.payload.sleds, msg.payload.quarries);

          }
          //if move was by me, only update stone statistics
          else{

            console.log("Received my own move from server, updating values");
            gameComponent.updateScoreSledQuarry(msg.payload.berlinerScore, msg.payload.sleds, msg.payload.quarries);
            //gameComponent.updateStoneDragStatus();  //TODO add this if stone drag breaks

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
