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
    let headers = new Headers({'Authorization': 'Bearer ' + this.authenticationService.token});
    let options = new RequestOptions({headers: headers});

    // get users from api
    return this.http.get(this.apiUrl + '/game/' + gameId, options)
      .map((response: Response) => response.json());
  }

  sendMove(move: Move) : Observable<Response> {

    //Sail played:
    if(this.gameComp.game.sailPlayed){

      if(this.gameComp.game.sailMove == null){
        //save first move in game (if there hasn't been a move yet)
        let sailMove1 = new Move(PositionEnum.Sled, PositionEnum.DepartingHarbour, move.pos, move.ShipID);
        this.gameComp.game.sailMove = sailMove1;
        return;
      }
      else{

        //Create the "play card" move to send to backend
        //TODO ensure correct ID in player component
        let sailCardMove = new Move(PositionEnum.PlayerCardStack, PositionEnum.Market, this.gameComp.game.sailId)

        //TODO
        let sailMove2 = new Move(PositionEnum.Sled, PositionEnum.DepartingHarbour, move.pos, move.ShipID);

        //Let game know chisel playing is over
        this.gameComp.game.sailPlayed = false;

        this.sendMove(sailCardMove).subscribe(resp => {
          console.log("SENT SAIL CARD MOVE TO BACKEND:", sailCardMove);

          this.sendMove(this.gameComp.game.sailMove).subscribe( resp => {

            console.log("SENT SAIL MOVE 1 TO BACKEND:", this.gameComp.game.sailMove);
            this.sendMove(sailMove2);
            console.log("SENT SAIL MOVE 2 TO BACKEND:", sailMove2);
            //TODO check that backend gets correct info

          });
        });

      }
    }

    //Chisel played:
    if(this.gameComp.game.chiselPlayed){

      if(this.gameComp.game.chiselMove == null){
        //save first move in game (if there hasn't been a move yet)
        let chiselMove1 = new Move(PositionEnum.Sled, PositionEnum.DepartingHarbour, move.pos, move.ShipID);
        this.gameComp.game.chiselMove = chiselMove1;
        return;
      }
      else{

        //Create the "play card" move to send to backend
        let chiselCardMove = new Move(PositionEnum.PlayerCardStack, PositionEnum.Market, this.gameComp.game.chiselId)

        let chiselMove2 = new Move(PositionEnum.Sled, PositionEnum.DepartingHarbour, move.pos, move.ShipID);

        //Let game know chisel playing is over
        this.gameComp.game.chiselPlayed = false;

        this.sendMove(chiselCardMove).subscribe(resp => {
          console.log("SENT CHISEL CARD MOVE TO BACKEND:", chiselCardMove);

          this.sendMove(this.gameComp.game.chiselMove).subscribe( resp => {

            console.log("SENT CHISEL MOVE 1 TO BACKEND:", this.gameComp.game.chiselMove);
            this.sendMove(chiselMove2);
            console.log("SENT CHISEL MOVE 2 TO BACKEND:", chiselMove2);
            //TODO check that backend gets correct info

          });
        });

      }
    }

    //Hammer played:
    else if(this.gameComp.game.hammerPlayed){
      let moveToSend = new Move(PositionEnum.PlayerCardStack, PositionEnum.Market, this.gameComp.game.hammerId);
      this.gameComp.game.hammerPlayed = false;
      this.sendMove(moveToSend).subscribe( resp => {

        console.log("SENT HAMMER MOVE 1 TO BACKEND:", moveToSend)
        let moveToSend2 = new Move(PositionEnum.Sled, PositionEnum.DepartingHarbour, move.pos, move.ShipID);
        this.gameComp.game.hammerPlayed = false;
        this.sendMove(moveToSend2);
        console.log("SENT HAMMER MOVE 2 TO BACKEND:", moveToSend2);
      });

    }

    //Lever played: let player choose order before sending move
    else if(this.gameComp.game.leverPlayed){
      if(move.to != PositionEnum.DepartingHarbour){
        this.gameComp.infoBoxComponent.leverShip = move.pos;

        //If ship was moved to site, save site name to infoboxcomponent (for use in its sendmove)
        if(move.to == PositionEnum.Market || move.to == PositionEnum.Pyramid || move.to == PositionEnum.Temple || move.to == PositionEnum.BurialChamber || move.to == PositionEnum.Obelisk   ){
          this.gameComp.infoBoxComponent.leverDestination = move.to;
        }

        this.gameComp.showLeverModal(move.pos);
      }
    }
    else if(!this.game.leverPlayed && !this.game.chiselPlayed && !this.game.sailPlayed && !this.game.hammerPlayed){ //if the lever modal is open, the ships shall not send any moves for moving stones on them

      let bodyString = JSON.stringify(move); // Stringify payload
      let headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.authenticationService.token
      });// ... Set content type to JSON
      let params = new URLSearchParams();
      params.set("token", this.authenticationService.token)
      let options = new RequestOptions({headers: headers, search: params}); // Create a request option

      console.log("send move: ", move);
      let req= this.http.post(this.apiUrl + '/game/' + this.game.id + '/move', bodyString, options) // ...using post request
        .catch((error: any) => Observable.throw(error.json().error || 'Server error')); //...errors if

        req.subscribe(response => {
          console.log("Sent Move: ", move);
        });
        return req;
    }
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
