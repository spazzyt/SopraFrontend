import {Component, OnInit, NgZone, ViewChild} from '@angular/core';
import {AuthenticationService} from "../shared/services/authentication.service";
import {Router} from "@angular/router";
import {User} from "../shared/models/user";
import {LobbyComponent} from "../lobby/lobby.component";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

//===========
// Component
//===========
export class LoginComponent implements OnInit {

  //============
  // Attributes
  //============

  // myself
  mySelf: User; //html-view: [(ngModel)]="user.username;

  // if login response failed
  loading = false; //??
  error = ''; //??

  // no idea what this is
  model: any = {}; //??


  //=============
  // Constructor
  //=============
  constructor(private router: Router,
              private authenticationService: AuthenticationService,
              private _ngZone: NgZone) {

  }

  //==========
  // ngOnInit
  //==========
  ngOnInit() {

    // logout: reset login status
    this.authenticationService.logout();

    //Instantiate mySelf as User
    this.mySelf = new User(null, null, null);

  }

  //===================
  // Subscribe-Methods
  //===================

  // send login request to backend in login.component.html: (click)="login()"
  // subscribe for backend response
  login() {
    this.authenticationService.login(this.mySelf)
      .subscribe(result => {

        if (result) {
          console.log("login:authenticationService.login(): ", result);
          this.router.navigate(['/lobby']);
        }
        else {
          this.error = 'Username exists';
          this.loading = false;
        }

      });
  }

  //===============
  // Other-Methods
  //===============

  // clear input field in html-view: (click)="clearfields()
  clearfields() {
    this.mySelf.username = '';
  }


  //===========================================
  // Enable Communication with Child Components
  //===========================================

  // Enable communication with ShipComponent
  @ViewChild(LobbyComponent) lobbyComponent:LobbyComponent;

}
