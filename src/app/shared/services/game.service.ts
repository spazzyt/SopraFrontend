import {Injectable, Input} from '@angular/core';
import {Http, Headers, RequestOptions, Response, URLSearchParams} from "@angular/http";
import {AuthenticationService} from "./authentication.service";
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import {Observable} from "rxjs";
import {Game} from "../models/game";
import {Router} from "@angular/router";
import {Move} from "../models/move";
import { environment } from '../../../environments/environment';
import {ColourEnum} from "../models/colour.enum";
import {PositionEnum} from "../models/position.enum";
import {Subject} from "rxjs/Subject";

@Injectable()
export class GameService {
  private apiUrl: string;
  private game: Game;


  @Input()
  gameComp: any;

  constructor(private http: Http,
              private router: Router,
              private authenticationService: AuthenticationService,
              private location: Location) {

    //TODO fill in your heroku-backend URL
    //this.apiUrl = 'https://sopra-fs17-group13.herokuapp.com';
   // this.apiUrl = 'http://localhost:8080'
    this.apiUrl = environment.apiProt + environment.apiUrl;
  }

  setGame(game: Game){
    this.game = game;
  }

  getGame(gameId): Observable<Game> {
    // add authorization header with token
    const headers = new Headers({'Authorization': 'Bearer ' + this.authenticationService.token});
    const options = new RequestOptions({headers: headers});

    // get users from api
    return this.http.get(this.apiUrl + '/game/' + gameId, options)
      .map((response: Response) => response.json());
  }

  sendMove(move: Move): Observable<Response> {
    console.log("sendMove=>",move,);
    // response observable
    let req = null;

    let leverSailMove;

    // special case for stupide lever
    if(this.gameComp.game.leverPlayed &&
      (move.from === PositionEnum.DepartingHarbour || move.to === PositionEnum.DepartingHarbour)){
      leverSailMove = move;
      req = new Subject();
    } else {
      // send the move first
      req = this._sendMove(move);
    }



    req.subscribe(response => {
      console.log("Move arrived in backend: ", move);
    });

    if(  this.gameComp.game.sailPlayed
      || this.gameComp.game.chiselPlayed
      || this.gameComp.game.hammerPlayed
      || this.gameComp.game.leverPlayed) {

      console.log("a card play is ongoing");

      // a part of the card move is played
      this.game.openCardMoves--;
    }

    //Sail played:
    if(this.gameComp.game.sailPlayed) {
    console.log("SendMove:SailHook");

      //after we placed the stone 'mark' step two, <- hack
      if(this.game.openCardMoves === 1)
        this.gameComp.game.sailMove = true;

      // once there are no more open moves
      if(this.game.openCardMoves === 0){
        this.gameComp.game.sailPlayed = false;
        this.gameComp.game.sailMove = null;
      }
    }
    //Chisel played:
    else if(this.gameComp.game.chiselPlayed) {

      console.log("SendMove:ChiselHook");

      //after we placed the first 'mark' step two, <- hack
      if(this.game.openCardMoves === 1)
        this.gameComp.game.chiselMove = true;

      // once there are no more open moves
      if(this.game.openCardMoves === 0)
        this.gameComp.game.chiselPlayed = false;

    }

    //Hammer played:
    else if(this.gameComp.game.hammerPlayed) {

      console.log("SendMove:HammerHook");

      // after playing the card
      if(this.game.openCardMoves === 2) {

        req.subscribe( resp => {
          console.log("HammerCard sent to market...");

          let moveToSend = new Move(PositionEnum.Quarry, PositionEnum.Sled, 3);
          console.log("BEFORE SENT HAMMER MOVE 1 TO BACKEND:", moveToSend);
          this.sendMove(moveToSend).subscribe(resp => {
            console.log("SENT HAMMER MOVE 1 TO BACKEND:", moveToSend)
          });

        });
      }
      //after we the stones 'mark' step two, <- hack
      if(this.game.openCardMoves === 1)
        this.gameComp.game.hammerMove = true;

      // once there are no more open moves
      if(this.game.openCardMoves === 0)
        this.gameComp.game.hammerPlayed = false;

    }

    //Lever played: let player choose order before sending move
    else if(this.gameComp.game.leverPlayed) {
      console.log("SendMove:LeverHook");

      // when we sail
      if(this.game.openCardMoves === 1)
      if(move.to != PositionEnum.DepartingHarbour) {


        this.gameComp.infoBoxComponent.leverShip = move.pos;
        let shipId = move.pos;

        //If ship was moved to site, save site name to infoboxcomponent (for use in its sendmove)
        if (move.to == PositionEnum.Market || move.to == PositionEnum.Pyramid || move.to == PositionEnum.Temple || move.to == PositionEnum.BurialChamber || move.to == PositionEnum.Obelisk) {
          this.gameComp.infoBoxComponent.leverDestination = move.to;
        }

        // will be called once the reordering is finished
        this.gameComp.infoBoxComponent.reorderCallback = (stoneArray) => {

          // first send the reordering!
          let leverMoveSort = new Move(PositionEnum.DepartingHarbour, PositionEnum.DepartingHarbour, shipId, shipId, stoneArray);


          this._sendMove(leverMoveSort).subscribe(resp => {
            console.log("SENT FIRST MOVE: ", leverMoveSort);

            // now we can resend the ship move
            this._sendMove(leverSailMove).subscribe(resp => {
              console.log("SENT SECOND MOVE: ", leverSailMove);

              this.game.leverPlayed = false;

              this.gameComp.siteMap[this.gameComp.siteToStringMap[move.to]].placeStones(this.game.ships[shipId].slots);
              //remove stones from ship
              this.gameComp.game.ships[shipId].slots = [];
            });
          });
        };

        this.gameComp.showLeverModal(move.pos);
      }
    }

    return req;
    }


    /*
     Actual sending to the backend without them wicked hooks
     */
  private _sendMove(move: Move) : Observable<Response> {
    let bodyString = JSON.stringify(move); // Stringify payload
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.authenticationService.token
    });// ... Set content type to JSON
    let params = new URLSearchParams();
    params.set("token", this.authenticationService.token)
    let options = new RequestOptions({headers: headers, search: params}); // Create a request option

    console.log("Sent move: ", move);
    return this.http.post(this.apiUrl + '/game/' + this.game.id + '/move', bodyString, options)
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'))
      .map((response: Response) => response.json())// ...using post request
      .share(); //...errors if
  }

    playCard(id: number) {

      let userDashboard = this.gameComp.playerMap[this.gameComp.myUserName];


      let cardId= -1;


      switch(id){
        /*
         Place 2 stones on 1 ship or 1 stone on each of 2 ships .
         After play, the card is placed on the discard pile .
         If you have not used the card by the end of the game, you
         will get 1 point for it.
         */
        case 5: //Chisel
          // card + place stone + place stone
          this.game.openCardMoves = 3;

          console.log("PLAYING CHISEL! STATUS: " + this.gameComp.game.chiselPlayed);
          this.gameComp.game.chiselPlayed = true;
          console.log("THE CHISEL HAS BEEN PLAYED! STATUS: " + this.gameComp.game.chiselPlayed);

          for(let card of userDashboard.marketCards){

            //search for hammer card in player's card array
            if(card.id == 24 || card.id == 25 || card.id == 26){
              cardId = card.id;
              break;
            }
          }
          this.gameComp.game.chiselId = cardId;
          console.log("PLAYED CHISEL CARD WITH ID " + cardId);
          break;


         /*
          Take 3 stones from the quarry and place them on your
          supply sled token . Then, place 1 stone from your supply
          sled token on 1 ship .
          After play, the card is placed on the discard pile .
          If you have not used the
           */
        case 6: //Hammer
          // card + take stones + place stone
          this.game.openCardMoves = 3;

          //lets the game know the hammer has been played
          console.log("PLAYING HAMMER! STATUS: " + this.gameComp.game.hammerPlayed);
          this.gameComp.game.hammerPlayed = true;
          console.log("THE HAMMER HAS BEEN PLAYED! STATUS: " + this.gameComp.game.hammerPlayed);

          for(let card of userDashboard.marketCards){

            //search for hammer card in player's card array
            if(card.id == 29 || card.id == 30){
              cardId = card.id;
              break;
            }
          }
          this.gameComp.game.hammerId = cardId;

          console.log("PLAYED HAMMER CARD WITH ID " + cardId);

          userDashboard.quarryStones -= 3;
          userDashboard.sledStones += 3;
          userDashboard.hasStones = true;



          break;

          /*
           Place 1 stone on 1 ship and sail this ship to a site.
           As always, of course, both conditions for sailing a ship
           must have been met.
           After play, the card is placed on the discard pile .
           If you have not used the card by the end of the game, you
           will get 1 point for it.
           */
        case 7: //Sail
          // card + place stone + sail
          this.game.openCardMoves = 3;

          console.log("PLAYING SAIL! STATUS: " + this.gameComp.game.sailPlayed);
          this.gameComp.game.sailPlayed = true;
          console.log("THE SAIL HAS BEEN PLAYED! STATUS: " + this.gameComp.game.sailPlayed);

          for(let card of userDashboard.marketCards){

            //search for sail card in player's card array
            if(card.id == 31 || card.id == 32 || card.id == 33){
              cardId = card.id;
              break;
            }
          }
          this.gameComp.game.sailId = cardId;
          console.log("PLAYED SAIL CARD WITH ID " + cardId);
          break;

          /*
           Sail 1 ship to a site. Decide for yourself what sequence to
           follow when unloading the stones.
           As always, of course, both conditions for sailing a ship
           must have been met. After play, the card is placed on the
           discard pile . If you have not used the card by the end of
           the game, you will get 1 point for it.
           */
        case 8: //Lever
          // card + sail + order
          this.game.openCardMoves = 3;

          //lets the game know the lever has been played
          console.log("PLAYING LEVER! STATUS: " + this.gameComp.game.leverPlayed);
          this.gameComp.game.leverPlayed = true;
          console.log("THE LEVER HAS BEEN PLAYED! STATUS: " + this.gameComp.game.leverPlayed);


          for(let card of userDashboard.marketCards){

            //search for lever card in card array
            if(card.id == 27 || card.id == 28){
              cardId = card.id;
              break;
            }
          }


          this.gameComp.infoBoxComponent.leverId = cardId;
          console.log("PLAYED LEVER CARD WITH ID " + cardId);



          this.gameComp.pyramidComponent.finalDestinationComponent.leverPlayed = this.gameComp.game.leverPlayed;
          this.gameComp.templeComponent.finalDestinationComponent.leverPlayed = this.gameComp.game.leverPlayed;
          this.gameComp.burialChamberComponent.finalDestinationComponent.leverPlayed = this.gameComp.game.leverPlayed;
          this.gameComp.obeliskComponent.finalDestinationComponent.leverPlayed = this.gameComp.game.leverPlayed;
          this.gameComp.marketComponent.finalDestinationComponent.leverPlayed = this.gameComp.game.leverPlayed;

          break;
      }


      let moveToSend = new Move(PositionEnum.PlayerCardStack, PositionEnum.Market, cardId);
      console.log("SendingMove: ", moveToSend);
      this.sendMove(moveToSend).subscribe( (res) => {
        console.log("Sent move:", res );
      });

    }

  //===========================================================
  // Popover Methods
  //===========================================================
  //TODO overhaul to make work on right-side players
  //IDs like "bll" are for bottom components, "bll_2" for top components

  initializePopovers(){

    //From bottom-left-left
    (<any>$('#bll')).popover({
      placement: 'top',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 50, hide: 20}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px"  class="non-draggable" src="../../../../assets/images/cards/chisel.png"/>'
    });


    //From bottom-middle-left
    (<any>$('#bml')).popover({
      placement: 'top',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 50, hide: 20}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px" class="non-draggable" src="../../../../assets/images/cards/hammer.png"/>'
    });


    //From bottom-middle-right
    (<any>$('#bmr')).popover({
      placement: 'top',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 50, hide: 20}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px" class="non-draggable" src="../../../../assets/images/cards/sail.png"/>'
    });

    //From bottom-right-right
    (<any>$('#brr')).popover({
      placement: 'top',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 50, hide: 20}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px" class="non-draggable" src="../../../../assets/images/cards/lever.png"/>'
    });

    //From purple-card
    (<any>$('#purple')).popover({
      placement: 'top',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 50, hide: 20}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px" class="non-draggable" src="../../../../assets/images/cards/statue.png"/>'
    });

    //From top-left-left
    (<any>$('#tll')).popover({
      placement: 'top',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 50, hide: 20}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px" class="non-draggable" src="../../../../assets/images/cards/pyramiddec.png"/>'
    });

    //From top-middle-left
    (<any>$('#tml')).popover({
      placement: 'top',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 50, hide: 20}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px" class="non-draggable" src="../../../../assets/images/cards/templedec.png"/>'
    });

    //From top-middle-right
    (<any>$('#tmr')).popover({
      placement: 'top',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 50, hide: 20}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px" class="non-draggable" src="../../../../assets/images/cards/burialdec.png"/>'
    });

    //From top-right-right
    (<any>$('#trr')).popover({
      placement: 'top',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 50, hide: 20}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px" class="non-draggable" src="../../../../assets/images/cards/obeliskdec.png"/>'
    });

    //From bottom-left-left
    (<any>$('#bll_2')).popover({
      placement: 'bottom',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 50, hide: 20}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px" class="non-draggable" src="../../../../assets/images/cards/chisel.png"/>'
    });


    //From bottom-middle-left
    (<any>$('#bml_2')).popover({
      placement: 'bottom',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 50, hide: 20}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px" class="non-draggable" src="../../../../assets/images/cards/hammer.png"/>'
    });


    //From bottom-middle-right
    (<any>$('#bmr_2')).popover({
      placement: 'bottom',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 50, hide: 20}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px" class="non-draggable" src="../../../../assets/images/cards/sail.png"/>'
    });

    //From bottom-right-right
    (<any>$('#brr_2')).popover({
      placement: 'bottom',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 50, hide: 20}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px" class="non-draggable" src="../../../../assets/images/cards/lever.png"/>'
    });

    //From purple-card
    (<any>$('#purple_2')).popover({
      placement: 'bottom',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 50, hide: 20}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px" class="non-draggable" src="../../../../assets/images/cards/statue.png"/>'
    });

    //From top-left-left
    (<any>$('#tll_2')).popover({
      placement: 'bottom',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 50, hide: 20}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px" class="non-draggable" src="../../../../assets/images/cards/pyramiddec.png"/>'
    });

    //From top-middle-left
    (<any>$('#tml_2')).popover({
      placement: 'bottom',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 50, hide: 20}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px" class="non-draggable" src="../../../../assets/images/cards/templedec.png"/>'
    });

    //From top-middle-right
    (<any>$('#tmr_2')).popover({
      placement: 'bottom',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 50, hide: 20}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px" class="non-draggable" src="../../../../assets/images/cards/burialdec.png"/>'
    });

    //From top-right-right
    (<any>$('#trr_2')).popover({
      placement: 'bottom',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 50, hide: 20}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px" class="non-draggable" src="../../../../assets/images/cards/obeliskdec.png"/>'
    });

    //From bottom-left-left
    (<any>$('#bll_3')).popover({
      placement: 'bottom',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 50, hide: 20}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px" class="non-draggable" src="../../../../assets/images/cards/chisel.png"/>'
    });


    //From bottom-middle-left
    (<any>$('#bml_3')).popover({
      placement: 'bottom',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 50, hide: 20}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px" class="non-draggable" src="../../../../assets/images/cards/hammer.png"/>'
    });


    //From bottom-middle-right
    (<any>$('#bmr_3')).popover({
      placement: 'bottom',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 50, hide: 20}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px" class="non-draggable" src="../../../../assets/images/cards/sail.png"/>'
    });

    //From bottom-right-right
    (<any>$('#brr_3')).popover({
      placement: 'bottom',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 50, hide: 20}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px" class="non-draggable" src="../../../../assets/images/cards/lever.png"/>'
    });

    //From purple-card
    (<any>$('#purple_3')).popover({
      placement: 'bottom',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 50, hide: 20}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px" class="non-draggable" src="../../../../assets/images/cards/statue.png"/>'
    });

    //From top-left-left
    (<any>$('#tll_3')).popover({
      placement: 'bottom',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 50, hide: 20}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px" class="non-draggable" src="../../../../assets/images/cards/pyramiddec.png"/>'
    });

    //From top-middle-left
    (<any>$('#tml_3')).popover({
      placement: 'bottom',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 50, hide: 20}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px" class="non-draggable" src="../../../../assets/images/cards/templedec.png"/>'
    });

    //From top-middle-right
    (<any>$('#tmr_3')).popover({
      placement: 'bottom',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 50, hide: 20}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px" class="non-draggable" src="../../../../assets/images/cards/burialdec.png"/>'
    });

    //From top-right-right
    (<any>$('#trr_3')).popover({
      placement: 'bottom',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 50, hide: 20}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px" class="non-draggable" src="../../../../assets/images/cards/obeliskdec.png"/>'
    });

    //From bottom-left-left
    (<any>$('#bll_4')).popover({
      placement: 'top',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 50, hide: 20}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px"  class="non-draggable" src="../../../../assets/images/cards/chisel.png"/>'
    });


    //From bottom-middle-left
    (<any>$('#bml_4')).popover({
      placement: 'top',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 50, hide: 20}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px" class="non-draggable" src="../../../../assets/images/cards/hammer.png"/>'
    });


    //From bottom-middle-right
    (<any>$('#bmr_4')).popover({
      placement: 'top',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 50, hide: 20}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px" class="non-draggable" src="../../../../assets/images/cards/sail.png"/>'
    });

    //From bottom-right-right
    (<any>$('#brr_4')).popover({
      placement: 'top',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 50, hide: 20}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px" class="non-draggable" src="../../../../assets/images/cards/lever.png"/>'
    });

    //From purple-card
    (<any>$('#purple_4')).popover({
      placement: 'top',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 50, hide: 20}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px" class="non-draggable" src="../../../../assets/images/cards/statue.png"/>'
    });

    //From top-left-left
    (<any>$('#tll_4')).popover({
      placement: 'top',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 50, hide: 20}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px" class="non-draggable" src="../../../../assets/images/cards/pyramiddec.png"/>'
    });

    //From top-middle-left
    (<any>$('#tml_4')).popover({
      placement: 'top',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 50, hide: 20}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px" class="non-draggable" src="../../../../assets/images/cards/templedec.png"/>'
    });

    //From top-middle-right
    (<any>$('#tmr_4')).popover({
      placement: 'top',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 50, hide: 20}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px" class="non-draggable" src="../../../../assets/images/cards/burialdec.png"/>'
    });

    //From top-right-right
    (<any>$('#trr_4')).popover({
      placement: 'top',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 50, hide: 20}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px" class="non-draggable" src="../../../../assets/images/cards/obeliskdec.png"/>'
    });



  }
}
