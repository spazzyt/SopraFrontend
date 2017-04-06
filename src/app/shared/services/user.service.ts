import { Injectable } from '@angular/core';
import {Http, Headers, RequestOptions, Response} from "@angular/http";
import {AuthenticationService} from "./authentication.service";
import {Observable} from "rxjs";
import {User} from "../models/user";

@Injectable()
export class UserService {

  //============
  // Attributes
  //============
  private apiUrl:string;


  //=============
  // Constructor
  //=============

  constructor(private http: Http,
              private authenticationService: AuthenticationService) {

    //TODO fill in your heroku-backend URL
    //this.apiUrl = 'https://sopra-fs17-group13.herokuapp.com';
    this.apiUrl='http://localhost:8080'

  }


  //==============
  // Http-Methods
  //==============

  // send http post request to backend: user:User
  // receive from backend: user:User[]
  // refresh localStorage-currentUser with: user:User
  getUsers(): Observable<User[]> {

    // add authorization header with token
    let headers = new Headers({ 'Authorization':
          'Bearer ' + this.authenticationService.token });

    // create a request option
    let options = new RequestOptions({ headers: headers });

    // get users from backend
    return this.http.get(this.apiUrl +'/user', options)

      //map response from json string to User[] object
      .map((response: Response) => {
        let users=response.json()

        console.log("user.service.ts-login()-response: ", response)
        console.log("user.service.ts-login()-response.json: ", response.json)
        console.log("user.service.ts-login()-user: ", users)

        return users;

    });


  }


  // Other-Methods
  //===============

  mySelf(){

    // get mySelf from authenticationService
    let mySelf = this.authenticationService.mySelf;

    console.log(mySelf);

    return mySelf;

  }

}

