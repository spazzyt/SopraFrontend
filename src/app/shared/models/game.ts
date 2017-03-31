import {User} from "./user";
/**
 * Created by benzro on 23.03.17.
 */

export class Game {

  //Backend attributes
  //==================
  public id:number;
  //public token: string; //check with backend
  public owner: string;
  public status: string;
  public numPlayers: number;
  public name: string;
  public players: User[];
  public currentPlayer: string;
  public moves: string[]; //data type: check with backend


  //Additional Frontend attributes
  //==============================

    constructor(){
    }
}
