import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../shared/services/authentication.service";
import {Router} from "@angular/router";
import {User} from "../shared/models/user";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

// Component
//===========
export class LoginComponent implements OnInit {

  // Attributes
  //============

  // myself
  mySelf: User; //html-view: [(ngModel)]="user.username;

  // if login response failed
  loading = false; //??
  error = ''; //??

  // no idea what this is
  model: any = {}; //??


  // Constructor
  //=============
  constructor(private router: Router,
              private service: AuthenticationService) {

  }

  // ngOnInit
  //==========
  ngOnInit() {

    // logout: reset login status
    this.service.logout();

    //Instantiate myself as user
    this.mySelf = new User();

  }

  // Subscribe-Methods
  //===================

  // send login request to backend in html-view: (click)="login()"
  login() {
    this.service.login(this.mySelf)
      .subscribe(result => {
        if (result) {
          this.router.navigate(['/lobby']);
        } else {
          this.error = 'Username exists';
          this.loading = false;
        }
      });
  }


  // Other-Methods
  //===============

  // clear input field in html-view: (click)="clearfields()
  clearfields() {
    this.mySelf.username = '';
  }

}
