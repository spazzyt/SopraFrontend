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

  private users: User[]=[];
  private games: Game[]=[];
  private game: string;
  private joinedGame : number=-1;
  private myself:any;

  constructor(private router:Router, private userService: UserService, private gameService: GameService) { }

  ngOnInit() {
    // get users from secure api end point
    this.userService.getUsers()
      .subscribe(users => {
        this.users = users;
      });

    // get games from secure api end point
    this.loadLobbyList();
    this.myself = this.userService.meMyselfAndI();
  }

  loadLobbyList(){
    this.gameService.getGames()
      .subscribe(games => {
        this.games = games;
      });
  }

  navigateToGame(){
  this.router.navigate(['/game']);
  }

  // get games from secure api end point
  addGame(numPlayers){
  this.gameService.addGameService(numPlayers)
    .subscribe(game => {
      //this.game = game;
      console.log("add game ");
      this.loadLobbyList();
    });
  }

  leaveGame(gameId){
    this.gameService.leaveGameService(gameId)
      .subscribe(game => {
        //this.game = game;
        console.log("leave game ");
        this.loadLobbyList();
        this.joinedGame=-1;
      });
  }

  joinGame(gameId){
    this.gameService.joinGameService(gameId)
      .subscribe(game => {
        //this.game = game;
        console.log("join game ");
        this.loadLobbyList();
        this.joinedGame=gameId;
      });
  }




}
