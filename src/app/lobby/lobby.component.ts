import {Component, OnInit, NgZone} from '@angular/core';
import {Router} from "@angular/router";

import {User} from "../shared/models/user";
import {Game} from "../shared/models/game";

import {UserService} from "../shared/services/user.service";
import {GameService} from "../shared/services/game.service";
import {LobbyService} from "../shared/services/lobby.service";
import {LoginComponent} from "../login/login.component";
import {AuthenticationService} from "../shared/services/authentication.service";
import {Observable} from "rxjs";
import {GameStatusEnum} from "../shared/models/game-status.enum";


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
  public requestIntervalTime = 1000; // set to 500 ms during development, for production set to 500 ms

  //who am I
  public mySelf:User; //fetched with: this.userService.MySelf()

  // helper property to add a new game
  public nrOfGames: number = -1;

  // game id of joined game
  public joinedGame : number=-1;

  // game name
  public game: string;

  private currentGameChecker;
  private gameListChecker;
  private userListChecker;


  //=============
  // Constructor
  //=============
  constructor(private router:Router,
              private userService: UserService,
              private gameService: GameService,
              private lobbyService: LobbyService,
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

    this.authenticationService.updateCookie();

    // interval to update game list (every X ms a request is made to the frontend)
    this.userListChecker = setInterval(()=>this.loadUserList(), this.requestIntervalTime);
    this.gameListChecker = setInterval(()=>this.loadGameList(), this.requestIntervalTime);

    // get username from userService
    this.mySelf=this.userService.mySelf();
    if(1){console.log("lobbyComponent:mySelf: ", this.mySelf);};



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
        if(1){console.log("fetch users: ", users);}
        this.users = users;
      });
  }

  // fetch list of games
  loadGameList(){
    this.lobbyService.getGames()
      .subscribe(games => {
        if(1){console.log("fetch games: ", this.games);}
        this.games = games;

        let foundmyself = false;
        for(let game of games){
          for(let player of game.players){
            if(player.username == this.mySelf.username){
              this.joinedGame = game.id;
              foundmyself=true;
            }
          }
        }
        if(!foundmyself){
          this.joinedGame = -1;
        }
      });
  }

  // add a new game to table
  addGame(numPlayers){
  this.lobbyService.addGameService(numPlayers)
    .subscribe(game => {
      //this.game = game;
      if(1){console.log("add game ");}
      console.log("JoinedGame IS: pepepepeppepe", this.joinedGame);
      return this.loadGameList();
    });
  }

  // leave a game ( seen in game table)
  leaveGame(gameId){
    this.lobbyService.leaveGameService(gameId)
      .subscribe(game => {
        //this.game = game;
        if(1){console.log("leave game ");}
        return this.loadGameList();
      });
  }

  //join a game in game table
  joinGame(gameId){
    this.lobbyService.joinGameService(gameId)
      .subscribe(game => {
        //this.game = game;
        if(1){console.log("join game ");}

        this.currentGameChecker = setInterval(()=>this.waitForGameStart(gameId), this.requestIntervalTime);

        return this.loadGameList();
      });
  }

  // n sec, to check if game has started
  waitForGameStart(gameId: number){
    this.gameService.getGame(gameId).subscribe((game) => {

      if(game.status == GameStatusEnum.STARTING)
      {
        this.gameStart(gameId);     //Start the game as soon as status changes to starting
        clearInterval(this.gameListChecker);  //stop intervals for getting game & user list
        clearInterval(this.userListChecker);
      }

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
    this.lobbyService.quickStart();
    clearInterval(this.gameListChecker);  //stop intervals for getting game & user list
    clearInterval(this.userListChecker);
  }

  quickStartBob(){
    //ask backend for new game
    this.lobbyService.quickStartBob();
    clearInterval(this.gameListChecker);  //stop intervals for getting game & user list
    clearInterval(this.userListChecker);
  }

  gameStart(gameId: number){
    this.router.navigate(['/game', gameId]);
  }
}
