import { Injectable } from '@angular/core';
import {Http, Headers, RequestOptions, Response, URLSearchParams} from "@angular/http";
import {AuthenticationService} from "./authentication.service";
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import {Observable} from "rxjs";
import {Router} from "@angular/router";
import {User} from "../models/user";
import { environment } from '../../../environments/environment';

@Injectable()
export class ActivePlayerService {
  private apiUrl: string;

  constructor(private http: Http,
              private router: Router,
              private authenticationService: AuthenticationService,
              private location: Location) {

    //TODO fill in your heroku-backend URL
    //this.apiUrl = 'https://sopra-fs17-group13.herokuapp.com';
   // this.apiUrl = 'http://localhost:8080'
    this.apiUrl = environment.apiProt + environment.apiUrl;
  }

  getActivePlayer(): Observable<User> {
    // add authorization header with token
    let headers = new Headers({'Authorization': 'Bearer ' + this.authenticationService.token});
    let options = new RequestOptions({headers: headers});

    // get active player from api
    return this.http.get(this.apiUrl + '/game', options)
      .map((response: Response) => response.json());
  }

}
