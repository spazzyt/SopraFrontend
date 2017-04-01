import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

import {LoginComponent} from "../login/login.component";
import {User} from "../shared/models/user";
import {Game} from "../shared/models/game";


import {UserService} from "../shared/services/user.service";
import {GameService} from "../shared/services/game.service";


@Component({
  selector: 'app-lobby',
  templateUrl: 'lobby.component.html',
  styleUrls: ['lobby.component.css']
})

export class LobbyComponent implements OnInit {

  //Attributes
  //==========
  private users: User[]=[];
  private games: Game[]=[];
  private game: string;
  private joinedGame : number=-1;
  private myself:any;
  private nrOfGames: number = -1;
  private requestIntervalTime = 5000 // set to 5000 during development, for production set to 500

  //Constructor
  //===========
  constructor(private router:Router,
              private userService: UserService,
              private gameService: GameService) { }


  //ngOnInit
  //==========
  ngOnInit() {

    // subscribe to service: get users from userService (from backend)
    this.loadUserList();

    // subscribe to service: get games from gameService (from backend)
    this.loadGameList();

    //
    this.myself = this.userService.meMyselfAndI();

    // interval to update game list (every X ms a request is made to the frontend)
    setInterval(()=>this.loadGameList(), this.requestIntervalTime)

  }

  //Methods
  //=======
  loadUserList(){
    this.userService.getUsers()
      .subscribe(users => {
        this.users = users;
      });
  }

  loadGameList(){
    this.gameService.getGames()
      .subscribe(games => {
        this.games = games;
      });
  }

  // get games from secure api end point
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

  navigateToGame(){
    this.router.navigate(['/game']);
  }

  Logout(){
    //tell backend about it
    //....
    //and navigate to home screen
    this.router.navigate(['']);


  }




  // helper functions from modal screen (can be done more direct with ng)
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





}
