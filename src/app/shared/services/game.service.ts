import { Injectable } from '@angular/core';
import {Http, Headers, RequestOptions, Response, URLSearchParams} from "@angular/http";
import {AuthenticationService} from "./authentication.service";
import {Observable} from "rxjs";
import {Game} from "../models/game";

@Injectable()
export class GameService {
  private apiUrl:string;

  constructor(
    private http: Http,
    private authenticationService: AuthenticationService) {

    //TODO fill in your heroku-backend URL
    //this.apiUrl = 'https://sopra-fs17-group13.herokuapp.com';
    this.apiUrl='http://localhost:8080'
  }

  getGames(): Observable<Game[]> {
    // add authorization header with token
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.authenticationService.token });
    let options = new RequestOptions({ headers: headers });

    // get users from api
    return this.http.get(this.apiUrl +'/game', options)
      .map((response: Response) => response.json());
  }


  addGameService(numPlayers): Observable<Game> {
    let bodyString = JSON.stringify({ numPlayers: numPlayers }); // Stringify payload
    let headers      = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.authenticationService.token});// ... Set content type to JSON
    let params = new URLSearchParams();
    params.set("token", this.authenticationService.token)
    let options       = new RequestOptions({ headers: headers, search: params }); // Create a request option

    return this.http.post(this.apiUrl+'/game', bodyString, options) // ...using post request
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
      .catch((error:any) => Observable.throw(error.json().error || 'Server error')); //...errors if
  }


}

