import {Component, OnInit, NgZone} from '@angular/core';
import {Router} from "@angular/router";

import {User} from "../shared/models/user";
import {Game} from "../shared/models/game";

import {UserService} from "../shared/services/user.service";
import {GameService} from "../shared/services/game.service";
import {LoginComponent} from "../login/login.component";
import {AuthenticationService} from "../shared/services/authentication.service";
import {Observable} from "rxjs";


@Component({
  selector: 'app-lobby',
  templateUrl: 'lobby.component.html',
  styleUrls: ['lobby.component.css']
})

//===========
// Component
//===========
export class LobbyComponent implements OnInit {

  //============
  // Attributes
  //============

  //to show list in lobby
  public users: User[] = []; //fetched with: this.userService.getUsers()
  public games: Game[] = []; //fetched with: this.gameService.getGames()

  //request interval time to get data from backend
  public requestIntervalTime = 20000; // set to 20000 ms during development, for production set to 500 ms

  //who am I
  public mySelf:User; //fetched with: this.userService.meMyselfAndI()

  // helper property to add a new game
  public nrOfGames: number = -1;

  // game id of joined game
  public joinedGame : number=-1;

  // game name
  public game: string;


  //=============
  // Constructor
  //=============
  constructor(private router:Router,
              private userService: UserService,
              private gameService: GameService,
              private authenticationService: AuthenticationService) {

  }

  //==========
  // ngOnInit
  //==========
  ngOnInit() {


    // subscribe to service: this.userService.getUsers()
    this.loadUserList();

    // subscribe to service: this.gameService.getGames()
    this.loadGameList();

    // interval to update game list (every X ms a request is made to the frontend)
    setInterval(()=>this.loadUserList(), this.requestIntervalTime);
    setInterval(()=>this.loadGameList(), this.requestIntervalTime);

    // get username from userService
    this.mySelf=this.userService.mySelf();



  }

  //================
  // ngAfterViewInit
  //================

  ngAfterViewInit() {


  }



  //===================
  // Subscribe-Methods
  //===================

  // fetch list of users
  loadUserList(){
    return this.userService.getUsers()
      .subscribe(users => {
        console.log("fetch users: ", users);
        this.users = users;
      });
  }

  // fetch list of games
  loadGameList(){
    this.gameService.getGames()
      .subscribe(games => {
        console.log("fetch games: ", this.games);
        this.games = games;
      });
  }

  // add a new game to table
  addGame(numPlayers){
  this.gameService.addGameService(numPlayers)
    .subscribe(game => {
      //this.game = game;
      console.log("add game ");
      return this.loadGameList();
    });
  }

  // leave a game ( seen in game table)
  leaveGame(gameId){
    this.gameService.leaveGameService(gameId)
      .subscribe(game => {
        //this.game = game;
        console.log("leave game ");
        this.joinedGame=-1;
        return this.loadGameList();
      });
  }

  //join a game in game table
  joinGame(gameId){
    this.gameService.joinGameService(gameId)
      .subscribe(game => {
        //this.game = game;
        console.log("join game ");
        this.joinedGame=gameId;
        return this.loadGameList();
      });
  }



  //===============
  // Other-Methods
  //===============

  navigateToGame(){
    this.router.navigate(['/game', this.joinedGame]);
  }

  Logout(){

    // tell backend about it ??

    // tell localStorage about it
    this.authenticationService.logout();

    //and navigate to home screen
    return this.router.navigate(['']);

  }

  addGames() {
    if(this.nrOfGames == 2){
      this.addGame(2);
    }
    else if(this.nrOfGames == 3){
      this.addGame(3);
    }
    else{
      this.addGame(4);
    }
  }

  //========================
  // Backend starts new game
  //========================

  quickStart(){

    //ask backend for new game
    this.gameService.quickStart();

  }

}
