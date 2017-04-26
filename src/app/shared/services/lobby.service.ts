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
export class LobbyService {
  private apiUrl: string;

  constructor(private http: Http,
              private router: Router,
              private authenticationService: AuthenticationService,
              private location: Location){

    //TODO fill in your heroku-backend URL
    //this.apiUrl = 'https://sopra-fs17-group13.herokuapp.com';
    //this.apiUrl = 'http://localhost:8080'
    this.apiUrl = environment.apiProt + environment.apiUrl;
  }


  //Generic option preparation that can be used for all functions
  getRequestOptions(){
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.authenticationService.token
    });// ... Set content type to JSON
    let params = new URLSearchParams();
    params.set("token", this.authenticationService.token)
    let options = new RequestOptions({headers: headers, search: params}); // Create a request option
    return options;
  }



  getGames(): Observable<Game[]> {
    // add authorization header with token
    let headers = new Headers({'Authorization': 'Bearer ' + this.authenticationService.token});
    let options = new RequestOptions({headers: headers});

    // get users from api
    return this.http.get(this.apiUrl + '/game', options)
      .map((response: Response) => response.json());
  }


  addGameService(numPlayers): Observable<Game> {
    let bodyString = JSON.stringify({numPlayers: numPlayers}); // Stringify payload

    return this.http.post(this.apiUrl + '/game', bodyString, this.getRequestOptions()) // ...using post request
      .map((response: Response) => {
        // login successful if there's a jwt token in the response
        let game = response.json() // && response.json();
        if (game) {
          console.log(game)
          return game;
        } else {
          // return false to indicate failed login
          return null;
        }
      }) // ...and calling .json() on the response to return data
      .catch((error: any) => Observable.throw(error.json().error || 'Server error')); //...errors if
  }


  leaveGameService(gameId): Observable<Game> {
    let bodyString = JSON.stringify({}); // Stringify payload

    return this.http.post(this.apiUrl + '/game/' + gameId + '/leave', bodyString, this.getRequestOptions()) // ...using post request
      .map((response: Response) => {
        // login successful if there's a jwt token in the response
        let game = response//.json() && response.json();
        if (game) {
          console.log(game)
        } else {
          // return false to indicate failed login
          return null;
        }
      }) // ...and calling .json() on the response to return data
      .catch((error: any) => Observable.throw(error.json().error || 'Server error')); //...errors if
  }


  joinGameService(gameId): Observable<Game> {
    let bodyString = JSON.stringify({}); // Stringify payload

    return this.http.post(this.apiUrl + '/game/' + gameId + '/join', bodyString, this.getRequestOptions()) // ...using post request
      .map((response: Response) => {
        // login successful if there's a jwt token in the response
        let game = response//.json() && response.json();
        if (game) {
          console.log(game)
        } else {
          // return false to indicate failed login
          return null;
        }
      }) // ...and calling .json() on the response to return data
      .catch((error: any) => Observable.throw(error.json().error || 'Server error')); //...errors if
  }


  quickStart() {
    //TODO finish quickstart
    console.log("quickstart init");

    let bodyString = JSON.stringify({}); // Stringify payload

    this.http.post(this.apiUrl + '/pepe', bodyString, this.getRequestOptions()) // ...using post request
      .catch((error: any) => Observable.throw(error.json().error || 'Server error')) //...errors if
      .subscribe(response => {
        let gameId = response.text();
        console.log("quick starting game: ", gameId, response);

        this.router.navigate(['/game', gameId]);
      });
  }

  quickStartBob() {
    //TODO finish quickstart
    console.log("quickstart init");

    let bodyString = JSON.stringify({}); // Stringify payload

    this.http.post(this.apiUrl + '/bob', bodyString, this.getRequestOptions()) // ...using post request
      .catch((error: any) => Observable.throw(error.json().error || 'Server error')) //...errors if
      .subscribe(response => {
        let gameId = response.text();
        console.log("quick starting game: ", gameId, response);

        this.router.navigate(['/game', gameId]);
      });
  }
}
