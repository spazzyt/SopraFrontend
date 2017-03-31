export class Stone {

  //Backend attributes
  //==================



  //Additional Frontend attributes
  //==============================

  //unique identifier
  public id:number=-1;

  //player colour
  public colour:string="";

  //where it is
  public currentPosition:string="";

  //stone image
  public imageUrl:string="";

  constructor(id_:number, colour_:string, currentPosition_?:string){

    //initialize attributes
    this.id=id_;
    this.colour=colour_;
    this.imageUrl = "../../../assets/images/stone_" + colour_ + ".png"
    this.currentPosition=currentPosition_;

  }

}



