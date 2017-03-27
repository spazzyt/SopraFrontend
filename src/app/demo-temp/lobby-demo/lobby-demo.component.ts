import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

import {User} from "../../shared/models/user";
import {Game} from "../../shared/models/game";


//Dummy data USERS, GAMES, MYSELF
const USERS: User[] = [
  {"id":1,"username":"sgfsdg","token":"20532346-150d-460f-829c-041f6fe1da2a","status":"OFFLINE","games":[],"moves":[]},
  {"id":2,"username":"rtwet","token":"7fb9330f-9ebe-4d6d-b182-679c875b43aa","status":"OFFLINE","games":[],"moves":[]},
  {"id":3,"username":"dfjoie","token":"704b639d-3d9e-4e61-a780-f7ee5f898e55","status":"OFFLINE","games":[],"moves":[]},
  {"id":4,"username":"Roland123","token":"f49e8030-0ef8-45a7-9c42-80eee85ddfd1","status":"OFFLINE","games":[],"moves":[]},
  {"id":5,"username":"hsdosdf","token":"aa8ef17c-7392-4b5c-bf91-c3132e588eaf","status":"OFFLINE","games":[],"moves":[]},
  {"id":6,"username":"Zulsdao","token":"b3a4af45-5578-4d70-8df8-26d4f40031da","status":"OFFLINE","games":[],"moves":[]}
  ];

const GAMES: Game[] = [{"id":1,"name":"sgfsdg","owner":"sgfsdg","status":null,"currentPlayer":null,"numPlayers":4,"moves":[],"players":[]},
  {"id":2,"name":"sgfsdg","owner":"sgfsdg","status":null,"currentPlayer":null,"numPlayers":2,"moves":[],"players":[]},
  {"id":3,"name":"dfjoie","owner":"dfjoie","status":null,"currentPlayer":null,"numPlayers":3,"moves":[],"players":[]},
  {"id":4,"name":"dfjoie","owner":"dfjoie","status":null,"currentPlayer":null,"numPlayers":2,"moves":[],"players":[]},
  {"id":5,"name":"dfjoie","owner":"dfjoie","status":null,"currentPlayer":null,"numPlayers":4,"moves":[],"players":[]},
  {"id":6,"name":"hsdosdf","owner":"hsdosdf","status":null,"currentPlayer":null,"numPlayers":3,"moves":[],"players":[]},
  {"id":7,"name":"hsdosdf","owner":"hsdosdf","status":null,"currentPlayer":null,"numPlayers":4,"moves":[],"players":[]}
  ];

const MYSELF: any=
  {"id":1,"username":"sgfsdg","token":"20532346-150d-460f-829c-041f6fe1da2a","status":"OFFLINE","games":[],"moves":[]};

@Component({
  selector: 'app-lobby-demo',
  templateUrl: './lobby-demo.component.html',
  styleUrls: ['./lobby-demo.component.css']
})

export class LobbyDemoComponent implements OnInit {


  private users: User[]=USERS;
  private games: Game[]=GAMES;
  private game: string;
  private joinedGame : number=-1;
  private myself:any=MYSELF;
  private nrOfGames: number = -1;

  constructor(private router:Router) { }

  ngOnInit() {

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

  addGame(nrOfPlayers){

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
