import { Injectable } from '@angular/core';
import {Http, Headers, RequestOptions, Response, URLSearchParams} from "@angular/http";
import {AuthenticationService} from "./authentication.service";
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import {Observable} from "rxjs";
import {Game} from "../models/game";

@Injectable()
export class GameService {
  private apiUrl: string;

  constructor(private http: Http,
              private authenticationService: AuthenticationService,
              private location: Location) {

    //TODO fill in your heroku-backend URL
    //this.apiUrl = 'https://sopra-fs17-group13.herokuapp.com';
    this.apiUrl = 'http://localhost:8080'
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
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.authenticationService.token
    });// ... Set content type to JSON
    let params = new URLSearchParams();
    params.set("token", this.authenticationService.token)
    let options = new RequestOptions({headers: headers, search: params}); // Create a request option

    return this.http.post(this.apiUrl + '/game', bodyString, options) // ...using post request
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


  leaveGameService(gameId): Observable<Game> {
    let bodyString = JSON.stringify({}); // Stringify payload
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.authenticationService.token
    });// ... Set content type to JSON
    let params = new URLSearchParams();
    params.set("token", this.authenticationService.token)
    let options = new RequestOptions({headers: headers, search: params}); // Create a request option

    return this.http.post(this.apiUrl + '/game/' + gameId + '/leave', bodyString, options) // ...using post request
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
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.authenticationService.token
    });// ... Set content type to JSON
    let params = new URLSearchParams();
    params.set("token", this.authenticationService.token)
    let options = new RequestOptions({headers: headers, search: params}); // Create a request option

    return this.http.post(this.apiUrl + '/game/' + gameId + '/join', bodyString, options) // ...using post request
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

  //to implement: Observable<string[]>{...}
  getRoundCard() {
    let dummy = ["ship_1", "ship_4", "ship_3", "ship_2"]
    return  dummy;
  }


  quickStart(){
    //TODO finish quickstart

    this.location.go('game');
    let bodyString = JSON.stringify({}); // Stringify payload
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.authenticationService.token
    });// ... Set content type to JSON
    let params = new URLSearchParams();
    params.set("token", this.authenticationService.token)
    let options = new RequestOptions({headers: headers, search: params}); // Create a request option

    return this.http.post(this.apiUrl + '/pepe', bodyString, options) // ...using post request
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
}
