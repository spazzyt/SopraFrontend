import {User} from "./user";
import {Move} from "./move";
import {GameStatusEnum} from "./game-status.enum";
import {Ship} from "./ship";
import {MarketCard} from "./market-card";
import {Decision} from "./decision";
/**
 * Created by benzro on 23.03.17.
 */

export class Game {

  //Backend attributes
  //==================

  // game id: check with backend
  public id:number;

  // check with backend
  public token: string;

  // player who created the game
  public owner: string;

  // name of the game displayed in lobby screen
  public name: string;

  // status of game
  public status: GameStatusEnum;

  // number of users playing
  public numPlayers: number;

  // users playing
  public players: User[];

  //ships in each round
  public ships:Ship[];

  //market cards in each round
  public marketCards:MarketCard[];

  // active player
  public currentActivePlayer: User;

  // check if necessary
  //public moves: string[]; //data type: check with backend
  //public moves: Move[]; //data type: check with backend

  // decision
  public decision:Decision;


  //Additional Frontend attributes
  //==============================

    constructor(id_:number, token_:string,
                owner_:string, name_:string, numPlayers_:number, players_:User[],
                ships_:Ship[], marketCards_:MarketCard[],
                currentActivePlayer_:User, decision_:Decision){

      this.id=id_;
      this.token=token_;
      this.owner=owner_;
      this.name=name_;
      this.numPlayers=numPlayers_;
      this.players=players_;
      this.ships=ships_;
      this.marketCards=marketCards_;
      this.currentActivePlayer=currentActivePlayer_;
      this.decision=decision_;

    }
}
