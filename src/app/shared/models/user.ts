import {Decision} from "./decision";
import {Game} from "./game";
import {Move} from "./move";
import {ColourEnum} from "./colour.enum";

export class User {

  //==================
  //Backend attributes
  //==================

  // Identification
  public id:number=-1;

  // Username added in: login.component.html
  public username:string;

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
  public colour:ColourEnum;



  //===============
  //Constructor
  //===============

  constructor(id_:number, username_:string, colour_:ColourEnum, playerField_?:number){
    //instantiated in login.component.ts
    this.id=id_;
    this.username=username_;
    this.colour=colour_;
    this.playerField=playerField_;
  }

}
