import {Decision} from "./decision";
export class User {

  //Backend attributes
  //==================

  //Identification
  public id:number=-1;
  public username:string;

  //Active Game
  public token: string=""; //??
  public status: string=""; //??
  public isCurrentPlayer:boolean=false;
  public decisions: Decision[]=[]; //container with allowable actions/moves;

  //Old Games
  public oldGames: number[]; //list of past games played; data type check with backend


  //Additional Frontend attributes
  //==============================



  constructor(){

    //

  }
}
