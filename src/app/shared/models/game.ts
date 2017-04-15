import {User} from "./user";
import {Move} from "./move";
import {GameStatusEnum} from "./game-status.enum";
import {Ship} from "./ship";
import {MarketCard} from "./market-card";
import {Decision} from "./decision";
import {ColourEnum} from "./colour.enum";
import {Stone} from "./stone";
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


  //changing round info
  //-------------------

  //ships in each round
  public ships:Ship[]=[];

  //round number
  public roundNumber: number;


  //market cards in each round
  public marketCards:MarketCard[]=[];


  //changing decision info
  //----------------------

  // active player
  public currentActivePlayerField: ColourEnum;


  // decision
  public decisions:Decision[]=[];


  //Additional Frontend attributes
  //==============================

  // PlayerFieldsIcons
  // [Score, Sled, Quarry, Statue, PyrDec, TemDec, BurDec, ObeDec, Chisel, Hammer, Sail, Lever]
  //    0      1      2      3        4       5       6      7        8      9      10     11
  public playerFieldIconsBlack:number[]=[0,0,0,0,0,0,0,0,0,0,0,0];
  public playerFieldIconsWhite:number[]=[0,0,0,0,0,0,0,0,0,0,0,0];
  public playerFieldIconsBrown:number[]=[0,0,0,0,0,0,0,0,0,0,0,0];
  public playerFieldIconsGray:number[]=[0,0,0,0,0,0,0,0,0,0,0,0];

  public playerFieldIconsBlackAsBoolean:boolean[]=this.numberToBoolean(this.playerFieldIconsBlack);
  public playerFieldIconsWhiteAsBoolean:boolean[]=this.numberToBoolean(this.playerFieldIconsWhite);
  public playerFieldIconsBrownAsBoolean:boolean[]=this.numberToBoolean(this.playerFieldIconsBrown);
  public playerFieldIconsGrayAsBoolean:boolean[]=this.numberToBoolean(this.playerFieldIconsGray);


  // Game State
  //-----------

  //Temple
  public stonesInTemple:Stone[];
  public totalStonesInTemple:number;
  public fieldHeightInTemple:number[];

  //Obelisk
  public stonesInObelisk:number[];

  //Player bottom left
  public bottomLeft_sledStones:number;
  public bottomLeft_quarryStones:number;
  public bottomLeft_marketCards:number[];

  //Player top left
  public topLeft_sledStones:number;
  public topLeft_quarryStones:number;
  public topLeft_marketCards:number[];

  //Player top right
  public topRight_sledStones:number;
  public topRight_quarryStones:number;
  public topRight_marketCards:number[];

  //Player bottom right
  public bottomRight_sledStones:number;
  public bottomRight_quarryStones:number;
  public bottomRight_marketCards:number[];



  // Own Decisions
  //--------------

  //to store own decisions
  public ownDecisions:Decision[]=[];



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
                currentActivePlayerField_:ColourEnum, decision_:Decision){

      //static info added in lobby
      this.id=id_;
      this.token=token_;
      this.name=name_; //gameName
      this.status=status_; //gameStatus pending/active/terminated/RoundNumber1 to 6
      this.numPlayers=numPlayers_;
      this.players=players_;
      //changing round info
      this.roundNumber=roundNumber_;//or gameStatusEnum.round1
      this.ships=ships_;
      this.marketCards=marketCards_;
      //changing decision info
      this.currentActivePlayerField=currentActivePlayerField_;
      this.decisions.push(decision_);



    }

    addDecision(decision_){
      this.decisions.push(decision_);
    }
    getLastDecision(){
      return this.decisions[this.decisions.length];
    }

    numberToBoolean(playerFieldIcons):boolean[]{
      let resultArray:boolean[]=[false,false,false,false,false,false,false,false,false,false,false,false];
      for (let i=0; i<playerFieldIcons.length;i++){
        if (playerFieldIcons[i]>0){
          resultArray[i]=true;
        }
        else{
          resultArray[i]=false;
        }
      }
      return resultArray;
    }
}






