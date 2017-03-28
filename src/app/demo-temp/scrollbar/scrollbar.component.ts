import { Component, OnInit } from '@angular/core';

import {Game} from "../../shared/models/game";

const GAMES: Game[] = [{"id":1,"name":"sgfsdg","owner":"sgfsdg","status":null,"currentPlayer":null,"numPlayers":4,"moves":[],"players":[]},
  {"id":2,"name":"sgfsdg","owner":"sgfsdg","status":null,"currentPlayer":null,"numPlayers":2,"moves":[],"players":[]},
  {"id":3,"name":"dfjoie","owner":"dfjoie","status":null,"currentPlayer":null,"numPlayers":3,"moves":[],"players":[]},
  {"id":4,"name":"dfjoie","owner":"dfjoie","status":null,"currentPlayer":null,"numPlayers":2,"moves":[],"players":[]},
  {"id":5,"name":"dfjoie","owner":"dfjoie","status":null,"currentPlayer":null,"numPlayers":4,"moves":[],"players":[]},
  {"id":6,"name":"hsdosdf","owner":"hsdosdf","status":null,"currentPlayer":null,"numPlayers":3,"moves":[],"players":[]},
  {"id":7,"name":"hsdosdf","owner":"hsdosdf","status":null,"currentPlayer":null,"numPlayers":4,"moves":[],"players":[]},
  {"id":2,"name":"sgfsdg","owner":"sgfsdg","status":null,"currentPlayer":null,"numPlayers":2,"moves":[],"players":[]},
  {"id":3,"name":"dfjoie","owner":"dfjoie","status":null,"currentPlayer":null,"numPlayers":3,"moves":[],"players":[]},
  {"id":4,"name":"dfjoie","owner":"dfjoie","status":null,"currentPlayer":null,"numPlayers":2,"moves":[],"players":[]},
  {"id":5,"name":"dfjoie","owner":"dfjoie","status":null,"currentPlayer":null,"numPlayers":4,"moves":[],"players":[]},
  {"id":6,"name":"hsdosdf","owner":"hsdosdf","status":null,"currentPlayer":null,"numPlayers":3,"moves":[],"players":[]},
  {"id":7,"name":"hsdosdf","owner":"hsdosdf","status":null,"currentPlayer":null,"numPlayers":4,"moves":[],"players":[]}

];

@Component({
  selector: 'app-scrollbar',
  templateUrl: './scrollbar.component.html',
  styleUrls: ['./scrollbar.component.css']
})
export class ScrollbarComponent implements OnInit {

  private games: Game[]=GAMES;
  private joinedGame : number=-1;

  constructor() { }

  ngOnInit() {
  }

}
