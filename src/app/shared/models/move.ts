import {PositionEnum} from "./position.enum";
export class Move {

  //Backend attributes
  //==================
  public id:number=-1;
  public from:PositionEnum;
  public to:PositionEnum;
  public pos:number; //check with backend about usage
  public message:string;


  //Additional Frontend attributes
  //==============================

  constructor(id_?:number, from_?:PositionEnum, to_?:PositionEnum, pos_?:number, message_?:string){

    this.id=id_;
    this.from=from_;
    this.to=to_;
    this.pos=pos_;
    this.message=message_;

  }


}



