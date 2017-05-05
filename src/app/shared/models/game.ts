import {User} from "./user";
import {GameStatusEnum} from "./game-status.enum";
import {Ship} from "./ship";
import {MarketCard} from "./market-card";
import {ColourEnum} from "./colour.enum";
/**
 * Created by benzro on 23.03.17.
 */

export class Game {

  //Backend attributes
  //==================

  //static info added in lobby
  //--------------------------

  // game id: check with backend
  public id:number;

  // check with backend
  public token: string;

  // name of the game displayed in lobby screen
  public name: string;

  // status of game
  public status: GameStatusEnum;

  // number of users playing
  public numPlayers: number;

  // users playing
  public players: User[];

  // cards each player has
  public player1CardDeck: MarketCard[];
  public player2CardDeck: MarketCard[];
  public player3CardDeck: MarketCard[];
  public player4CardDeck: MarketCard[];

  //changing round info
  //-------------------

  //ships in each round
  public ships:Ship[]=[];

  //round number
  public roundNumber: number;


  //market cards in each round
  public marketCards:MarketCard[]=[];

  // active player
  public currentActivePlayerField: ColourEnum;

  public whoCanPickCard: string;
  public canIPick: boolean;

  //Is the lever modal open? (If yes, we don't send moves to the backend when moving stones to ship)
  public leverModalOpen: boolean;

  //This determines (locally) if the player has just played the lever card
  public leverPlayed: boolean;

  //This determines (locally) if the player has just played the lever card
  public hammerPlayed: boolean;
  public hammerId: number;

  // Own Player info
  //------------

  // my username entered in login screen
  // get username from userService
  myUserName:string;

  // my player field
  myPlayerField:ColourEnum;

  // am I the current active player
  amI_CurrentActivePlayer:boolean;



  //Constructor
  //===========

  constructor(id_:number, token_:string, name_:string, status_: GameStatusEnum,
                numPlayers_:number, players_:User[],
                roundNumber_:number, ships_:Ship[], marketCards_:MarketCard[],
                currentActivePlayerField_:ColourEnum){

      //static info added in lobby
      this.id=id_;
      this.token=token_;
      this.name=name_; //gameName
      this.status=status_; //gameStatus pending/active/terminated
      this.numPlayers=numPlayers_;
      this.players=players_;
      //changing round info
      this.roundNumber=roundNumber_;
      this.ships=ships_;
      this.marketCards=marketCards_;
      this.currentActivePlayerField=currentActivePlayerField_;
      this.leverModalOpen = false;
      this.leverPlayed = false;
      this.hammerPlayed = false;
      this.hammerId = 0;

  }

}






