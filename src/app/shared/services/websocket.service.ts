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
            //console.log("market card for game: ", inputcards[j])
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
          break;


        //Update currentActivePlayerField in game component
        case 'CURRENTTURN':
          let whoseTurn = msg.payload.user;

          //ensure players can't pick card if not intended
          gameComponent.game.whoCanPickCard = null;
          gameComponent.updateCardPick();

          //let game know whose turn it is
          console.log('It\'s ' + whoseTurn + "'s turn.");
          console.log("my name is: ", gameComponent.game.myPlayerField, gameComponent.game.myUserName)
          gameComponent.setPlayerField(whoseTurn);
          break;

        //Someone has to pick a card
        case 'PICKCARD':
          //pass to game who's turn it is to pick card
          gameComponent.game.whoCanPickCard = msg.payload.user;
          gameComponent.updateCardPick();
          gameComponent.setPlayerField();
          gameComponent.game.amI_CurrentActivePlayer = false;

          console.log(gameComponent.game.whoCanPickCard, 'can pick a card, is that me? ->' ,gameComponent.game.canIPick)

          //ensure correct player field status (active/inactive)
          gameComponent.bottomLeftComponent.playerFieldGlow(false);
          gameComponent.topLeftComponent.playerFieldGlow(false);
          gameComponent.topRightComponent.playerFieldGlow(false);
          gameComponent.bottomRightComponent.playerFieldGlow(false);

          //activate glow on the player whose pick it is
          gameComponent.playerMap[gameComponent.game.whoCanPickCard].playerFieldGlow(true);


          //Snackbar message: who can pick a card?
          if(gameComponent.game.canIPick) //i can pick
            gameComponent.showSnackbarMessage("You may pick a card from the market.");
          else  //someone else can pick
            gameComponent.showSnackbarMessage(gameComponent.game.whoCanPickCard.substring(0,10) + " may pick a card from the market.");

          break;


        //Execute other player's move
        case 'PLAYEDMOVE':
          console.log("The server tells us to do the following:")
          console.log(msg.payload);

          //ensure players can't pick card if not intended
          gameComponent.game.whoCanPickCard = null;
          gameComponent.updateCardPick();

          if(msg.payload.player != this.authenticationService.mySelf.username) //if this move is not from me, update:
          {
            let moveToDo = msg.payload.move;
            gameComponent.updateUiForOneMove(moveToDo, msg.payload.player, msg.payload.berlinerScore, msg.payload.sleds, msg.payload.quarries, msg.payload.youMad);

          }
          //if move was by me, only update stone statistics
          else{

            console.log("Received my own move from server, updating values");
            gameComponent.updateScoreSledQuarry(msg.payload.berlinerScore, msg.payload.sleds, msg.payload.quarries);
            gameComponent.updatePlayerCards(msg.payload.youMad); //update player cards
            gameComponent.updateStoneDragStatus();
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
