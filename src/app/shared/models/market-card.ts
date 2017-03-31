
export class MarketCard {

  //Backend attributes
  //==================



  //Additional Frontend attributes
  //==============================

  //unique identifier
  public id:number=-1;

  //card name
  public name:string="";

  //where it is
  public currentPosition:string="";

  //stone image
  public imageUrl:string="";

  constructor(id_:number, currentPosition_?:string){

    //initialize attributes
    this.id=id_;
    this.name=this.idToName(id_);
    this.imageUrl = "../../../assets/images/cards/" + this.name + ".png"
    this.currentPosition=currentPosition_;

  }

  idToName(id){
    switch (id)
    {
      case'01':
        return "burialdec";
      case'02':
        return "chisel";
      case'03':
        return "entrance";
      case'04':
        return "hammer";
      case'05':
        return "lever";
      case'06':
        return "obeliskdec";
      case'07':
        return "pyramiddec";
      case'08':
        return "sail";
      case'09':
        return "sacophagus";
      case'10':
        return "statues";
      case'11':
        return "templedec"
      default:
        alert("Error");
        return null;
    }
  }



}
