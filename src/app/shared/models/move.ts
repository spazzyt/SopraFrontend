import {PositionEnum} from "./position.enum";
export class Move {

  //Backend attributes
  //==================
  public from:PositionEnum;
  public to:PositionEnum;
  public pos:number; //check with backend about usage
  public message:string;
  public ShipID:number;


  //Additional Frontend attributes
  //==============================

  constructor(from_: PositionEnum, to_: PositionEnum, pos_: number, shipId_?: number){

    this.from=from_;
    this.to=to_;
    this.pos=pos_;
    this.ShipID=shipId_;

  }


}



