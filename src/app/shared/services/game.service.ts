import { Injectable } from '@angular/core';
import {Http, Headers, RequestOptions, Response, URLSearchParams} from "@angular/http";
import {AuthenticationService} from "./authentication.service";
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import {Observable} from "rxjs";
import {Game} from "../models/game";
import {Router} from "@angular/router";
import {Move} from "../models/move";
import { environment } from '../../../environments/environment';

@Injectable()
export class GameService {
  private apiUrl: string;
  private game: Game;

  constructor(private http: Http,
              private router: Router,
              private authenticationService: AuthenticationService,
              private location: Location) {

    //TODO fill in your heroku-backend URL
    //this.apiUrl = 'https://sopra-fs17-group13.herokuapp.com';
   // this.apiUrl = 'http://localhost:8080'
    this.apiUrl = environment.apiUrl;
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

  sendMove(move: Move){
    let bodyString = JSON.stringify(move); // Stringify payload
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.authenticationService.token
    });// ... Set content type to JSON
    let params = new URLSearchParams();
    params.set("token", this.authenticationService.token)
    let options = new RequestOptions({headers: headers, search: params}); // Create a request option

    this.http.post(this.apiUrl + '/game/' + this.game.id + '/move', bodyString, options) // ...using post request
      .catch((error: any) => Observable.throw(error.json().error || 'Server error')) //...errors if
      .subscribe(response => {
        console.log("Sent Move: ", move);
      });
  }

  //TODO implement: Observable<string[]>{...}
  getRoundCard() {
    let dummy = ["ship_1", "ship_4", "ship_3", "ship_2"]
    return  dummy;
  }

}
