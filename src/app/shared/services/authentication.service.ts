import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions, Jsonp} from "@angular/http";
import {User} from "../models/user";
import {Observable} from 'rxjs/Rx';
import { environment } from '../../../environments/environment';


@Injectable()
export class AuthenticationService {

  //============
  // Attributes
  //============

  //My User Object:
  // set from local storage (if page only reloaded) or
  // set with this.login() (if logged in)
  public mySelf: User = null;

  //My User Token:
  // set from local storage (if page only reloaded) or
  // set with this.login() (if logged in)
  public token: string = "";

  //Backend address (localhost or heroku)
  private apiUrl: string = "";

  //============
  // Constructor
  //=============
  constructor(private http: Http,
              private jsonp: Jsonp) {

    // set mySelf, if saved in local storage
    // (assumes local user always logs in with the same name)
    const mySelf = JSON.parse(localStorage.getItem('mySelf'));
    this.token = mySelf && mySelf.token;
    this.mySelf = mySelf;

    //TODO fill in your heroku-backend URL
    //this.apiUrl = 'https://sopra-fs17-group13.herokuapp.com';
    //this.apiUrl = 'http://localhost:8080'
    this.apiUrl = environment.apiProt + environment.apiUrl;
  }

  updateCookie(){
    const mySelf = JSON.parse(localStorage.getItem('mySelf'));
    this.token = mySelf && mySelf.token;
    this.mySelf = mySelf;
  }


  //==============
  // Http-Methods
  //==============

  // send http post request to backend: username:user.username
  // receive from backend: user:User
  // refresh localStorage-currentUser with: user:User
  login(user: User): Observable<User> {

    // Stringify payload
    let bodyString = JSON.stringify({username: user.username});

    // Set content type to JSON
    const headers = new Headers({'Content-Type': 'application/json'});

    // Create a request option
    let options = new RequestOptions({headers: headers});

    // Post request: send bodyString and options to '/user'
    let httpPost = this.http.post(this.apiUrl + '/user', bodyString, options)

      //map response from json string to User object
      .map((response: Response) => {

        // login successful if there's a jwt token in the response
        //let user = response.json() && response.json();
        const user = response.json();

        if (user) {

          // set token property
          this.token = user.token;

          // store username and jwt token in local storage
          // to keep user logged in between page refreshes
          localStorage.setItem('mySelf',
            JSON.stringify({username: user.username, id: user.id, token: this.token})
          );

          // return user to indicate successful login
          return user;

        } else {

          // return null to indicate failed login
          return null;

        }

      }) // ...and calling .json() on the response to return data

      .catch((error: any) =>
        Observable.throw(error.json().error || 'Server error')); //...errors if

    console.log("authentication.service.ts-login()-httpPost: ", httpPost)
    return httpPost;

  }

  //===============
  // Other-Methods
  //===============

  // logout:
  // clear token remove user from local storage to log user out
  // TODO?? inform backend
  logout(): void {
    this.token = null;
    localStorage.removeItem('mySelf');
  }

}
