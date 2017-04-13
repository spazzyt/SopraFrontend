import {User} from "./user";
import {Move} from "./move";
import {GameStatusEnum} from "./game-status.enum";
import {Ship} from "./ship";
import {MarketCard} from "./market-card";
import {Decision} from "./decision";
import {ColourEnum} from "./colour.enum";
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
  public currentActivePlayerField: ColourEnum;

  //round number
  public roundNumber: number;

  // decision
  public decision:Decision;


  //Additional Frontend attributes
  //==============================


  //Constructor
  //===========

  constructor(id_:number, token_:string,
                name_:string, numPlayers_:number, players_:User[],
                roundNumber_:number, ships_:Ship[], marketCards_:MarketCard[],
                currentActivePlayerField_:ColourEnum, decision_:Decision){

      //static info added in lobby
      this.id=id_;
      this.token=token_;
      this.name=name_; //gameName
      this.numPlayers=numPlayers_;
      this.players=players_;
      //changing round info
      this.roundNumber=roundNumber_;
      this.ships=ships_;
      this.marketCards=marketCards_;
      //changing decision info
      this.currentActivePlayerField=currentActivePlayerField_;
      this.decision=decision_;

    }
}






