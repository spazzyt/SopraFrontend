import { Injectable } from '@angular/core';
import {Http, Response, Headers, RequestOptions, Jsonp} from "@angular/http";
import {User} from "../models/user";
import {Observable} from 'rxjs/Rx';

@Injectable()
export class AuthenticationService {
  public token: string;
  private apiUrl:string;

  constructor(private http: Http, private jsonp: Jsonp) {
    // set token if saved in local storage
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.token = currentUser && currentUser.token;

    //TODO fill in your heroku-backend URL
    //this.apiUrl = 'https://sopra-fs17-group13.herokuapp.com';
    this.apiUrl='http://localhost:8080'
  }

  login(user:User): Observable<User> {
    let bodyString = JSON.stringify({ name: user.name, username: user.username }); // Stringify payload
    let headers      = new Headers({ 'Content-Type': 'application/json'});// ... Set content type to JSON
    let options       = new RequestOptions({ headers: headers }); // Create a request option

    return this.http.post(this.apiUrl+'/user', bodyString, options) // ...using post request
      .map((response: Response) => {
        // login successful if there's a jwt token in the response
        let user = response.json() && response.json();
        if (user) {
          // set token property
          this.token = user.token;
          // store username and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify({ username: user.username, token: this.token }));
          // return true to indicate successful login
          return user;
        } else {
          // return false to indicate failed login
          return null;
        }
      }) // ...and calling .json() on the response to return data
      .catch((error:any) => Observable.throw(error.json().error || 'Server error')); //...errors if
  }



  logout(): void {
    // clear token remove user from local storage to log user out
    this.token = null;
    localStorage.removeItem('currentUser');
  }

}
