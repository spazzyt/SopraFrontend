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


  constructor(){} //instantiated in login.component.ts

}
