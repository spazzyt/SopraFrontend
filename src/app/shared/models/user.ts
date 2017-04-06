import {Decision} from "./decision";
import {Game} from "./game";
import {Move} from "./move";

export class User {

  //==================
  //Backend attributes
  //==================

  // Identification
  public id:number=-1;
  public username:string; //added in: login.component.html

  // Active Game
  public token: string=""; //??

  // active user
  public status: string=""; //??
  //public isCurrentPlayer:boolean=false; //makes problem in lobby-demo components when compiling

  // container with allowable actions/moves;
  public decisions: Decision[]=[];

  //list of past games played
  public oldGames: number[]; // data type check with backend


  //===============================
  // Additional Frontend attributes
  //===============================

  public games:Game[];
  public moves:Move[];
  public playerField:number;
  public colour:string;



  //===============
  //Constructor
  //===============

  constructor(id_?:number, username_?:string, colour_?:string, playerField_?:number){
    //instantiated in login.component.ts
    this.id=id_;
    this.username=username_;
    this.colour=colour_;
    this.playerField=playerField_;
  }

}
