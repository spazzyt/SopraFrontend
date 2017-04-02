import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

import {User} from "../shared/models/user";
import {Game} from "../shared/models/game";

import {UserService} from "../shared/services/user.service";
import {GameService} from "../shared/services/game.service";
import {LoginComponent} from "../login/login.component";
import {AuthenticationService} from "../shared/services/authentication.service";


@Component({
  selector: 'app-lobby',
  templateUrl: 'lobby.component.html',
  styleUrls: ['lobby.component.css']
})

// Component
//===========
export class LobbyComponent implements OnInit {

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

  // number of players that joined a game
  public joinedGame : number=-1; //??

  // game name
  public game: string; //??



  // Constructor
  //=============
  constructor(private router:Router,
              private userService: UserService,
              private gameService: GameService,
              private authenticationService: AuthenticationService) {

  }


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

    // subscribe to service: this.userService.meMyselfAndI()
    this.whoAmI();

  }

  // Subscribe-Methods
  //===================

  // fetch list of users
  loadUserList(){
    this.userService.getUsers()
      .subscribe(users => {
        this.users = users;
        console.log("fetch users: ", this.users);
      });
  }

  // fetch list of games
  loadGameList(){
    this.gameService.getGames()
      .subscribe(games => {
        this.games = games;
        console.log("fetch games: ", this.games);
      });
  }

  //fetch my user name from localStorage
  whoAmI(){
    this.mySelf=this.userService.meMyselfAndI()
  }

  // add a new game to table
  addGame(numPlayers){
  this.gameService.addGameService(numPlayers)
    .subscribe(game => {
      //this.game = game;
      console.log("add game ");
      this.loadGameList();
    });
  }

  // leave a game ( seen in game table)
  leaveGame(gameId){
    this.gameService.leaveGameService(gameId)
      .subscribe(game => {
        //this.game = game;
        console.log("leave game ");
        this.loadGameList();
        this.joinedGame=-1;
      });
  }

  //join a game in game table
  joinGame(gameId){
    this.gameService.joinGameService(gameId)
      .subscribe(game => {
        //this.game = game;
        console.log("join game ");
        this.loadGameList();
        this.joinedGame=gameId;
      });
  }

  // Other-Methods
  //===============

  navigateToGame(){
    this.router.navigate(['/game']);
  }

  Logout(){

    // tell backend about it ??

    // tell localStorage about it
    this.authenticationService.logout();

    //and navigate to home screen
    this.router.navigate(['']);

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


/*directly with event binding
  changeGameVariable_2(){
    this.nrOfGames = 2;
    console.log("Glückwunsch, Sie haben erfolgreich 2 Spieler ausgewählt!");
  }

  changeGameVariable_3(){
    this.nrOfGames = 3;
    console.log("Glückwunsch, Sie haben erfolgreich 3 Spieler ausgewählt!");
  }

  changeGameVariable_4(){
    this.nrOfGames = 4;
    console.log("Glückwunsch, Sie haben erfolgreich 4 Spieler ausgewählt!");
  }
*/



}
