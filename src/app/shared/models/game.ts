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


  //changing decision info
  //----------------------

  // active player
  public currentActivePlayerField: ColourEnum;

  public whoCanPickCard: string;
  public canIPick: boolean;


  //Additional Frontend attributes
  //==============================


  //whole set of market cards
  public wholeMarketCardSet:MarketCard[]=[];




  // PlayerFieldsIcons
  // [Statue, PyrDec, TemDec, BurDec, ObeDec, Chisel, Hammer, Sail, Lever]
  //      0      1      2      3        4       5       6      7        8
  public playerFieldIconsBlack:number[]=[0,0,0,0,0,0,0,0,0];
  public playerFieldIconsWhite:number[]=[0,0,0,0,0,0,0,0,0];
  public playerFieldIconsBrown:number[]=[0,0,0,0,0,0,0,0,0];
  public playerFieldIconsGray:number[]=[0,0,0,0,0,0,0,0,0];

  public playerFieldIconsBlackAsBoolean:boolean[]=this.numberToBoolean(this.playerFieldIconsBlack);
  public playerFieldIconsWhiteAsBoolean:boolean[]=this.numberToBoolean(this.playerFieldIconsWhite);
  public playerFieldIconsBrownAsBoolean:boolean[]=this.numberToBoolean(this.playerFieldIconsBrown);
  public playerFieldIconsGrayAsBoolean:boolean[]=this.numberToBoolean(this.playerFieldIconsGray);



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
                currentActivePlayerField_:ColourEnum, decision_?:Decision){

      //static info added in lobby
      this.id=id_;
      this.token=token_;
      this.name=name_; //gameName
      this.status=status_; //gameStatus pending/active/terminated/RoundNumber1 to 6
      this.numPlayers=numPlayers_;
      this.players=players_;
      //changing round info
      this.roundNumber=roundNumber_;
      this.ships=ships_;
      this.marketCards=marketCards_;
      this.currentActivePlayerField=currentActivePlayerField_;



  }


  cardArrayToNumberArray(cards: MarketCard[]){

    // PlayerFieldsIcons
    // [Statue, PyrDec, TemDec, BurDec, ObeDec, Chisel, Hammer, Sail, Lever]
    //      0      1      2        3      4       5       6      7      8

    let returnArray = [0,0,0,0,0,0,0,0,0]

    for(let card of cards){
      if(card.id >= 0 && card.id <= 9){ //Statue
        returnArray[0] += 1;
      }
      else if(card.id >= 10 && card.id <= 11){
        returnArray[1] += 1;
      }
      else if(card.id >= 12 && card.id <= 13){
        returnArray[4] += 1;
      }
      else if(card.id >= 14 && card.id <= 15){
        returnArray[3] += 1;
      }
      else if(card.id >= 16 && card.id <= 17){
        returnArray[2] += 1;
      }
      else if(card.id >= 24 && card.id <= 26){
        returnArray[5] += 1;
      }
      else if(card.id >= 27 && card.id <= 28){
        returnArray[8] += 1;
      }
      else if(card.id >= 29 && card.id <= 30){
        returnArray[6] += 1;
      }
      else if(card.id >= 31 && card.id <= 33){
        returnArray[7] += 1;
      }
    }

    return returnArray;
  }


    numberToBoolean(playerFieldIcons):boolean[]{
      let resultArray:boolean[]=[false,false,false,false,false,false,false,false,false];
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






