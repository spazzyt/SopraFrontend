import {PositionEnum} from "./position.enum";
export class Move {

  //Backend attributes
  //==================
  public from:PositionEnum;
  public to:PositionEnum;
  public pos:number; //check with backend about usage
  public ShipID:number;
  public LeverStones:number[];


  //Additional Frontend attributes
  //==============================

  constructor(from_: PositionEnum, to_: PositionEnum, pos_: number, shipId_?: number, leverStones_?: number[]){

    this.from=from_;
    this.to=to_;
    this.pos=pos_;
    this.ShipID=shipId_;
    this.LeverStones=leverStones_;

  }


}

// LEVER, first move (new ship order)

// FROM         PlayerCardStack
// TO           Market
// POS          card_id (get from gamecomponent.game.playerdeck
// ShipID       ship_id (get from modal lel)
// LeverStones  stones_on_ship (stonearray)
