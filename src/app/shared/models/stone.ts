import {ColourEnum} from "./colour.enum";
import {PositionEnum} from "./position.enum";
export class Stone {

  //Backend attributes
  //==================



  //Additional Frontend attributes
  //==============================

  //unique identifier
  public id:number=-1;

  //player colour
  public colour:ColourEnum;

  //where it is
  public currentPosition:PositionEnum;

  //stone image
  public imageUrl:string="";

  constructor(id_:number, colour_:ColourEnum, currentPosition_?:PositionEnum){

    //initialize attributes
    this.id=id_;
    this.colour=colour_;
    this.imageUrl = "../../../assets/images/stone_" + colour_ + ".png"
    this.currentPosition=currentPosition_;

  }

}



