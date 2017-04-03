import {User} from "./user";
import {Move} from "./move";
/**
 * Created by benzro on 23.03.17.
 */

export class Game {

  //Backend attributes
  //==================

  // game id: check with backend
  public id:number;

  // public token: string; //check with backend
  public owner: string;

  // ??
  public status: string;

  // number of users playing
  public numPlayers: number;

  // name of the game displayed in lobby screen
  public name: string;

  // users in the game screen
  public players: User[];

  // active player
  public currentPlayer: string;

  // check if necessary
  public moves: string[]; //data type: check with backend
  //public moves: Move[]; //data type: check with backend


  //Additional Frontend attributes
  //==============================

    constructor(){
    }
}
