/**
 * Created by SaliZumberi on 13.02.2017.
 */

export class User {

  //Backend attributes
  //==================
  public id:number;
  public token: string;
  public status: string;
  public games: number[]; //list of past games played; data type check with backend
  public moves: number[]; //list allowable moves; data type check with backend
  public username:string;

  //Additional Frontend attributes
  //==============================

  constructor(){
  }
}
