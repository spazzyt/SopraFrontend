import {Decision} from "./decision";

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
  public isCurrentPlayer:boolean=false;

  // container with allowable actions/moves;
  public decisions: Decision[]=[];

  //list of past games played
  public oldGames: number[]; // data type check with backend


  //===============================
  // Additional Frontend attributes
  //===============================



  constructor(){} //instantiated in login.component.ts

}
