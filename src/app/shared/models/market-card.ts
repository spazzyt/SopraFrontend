
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

  //constructor
  constructor(id_:number, currentPosition_?:string){

    //initialize attributes
    this.id=id_;
    this.name=this.idToName(id_);
    this.imageUrl = "../../../assets/images/cards/" + this.name + ".png"
    //console.log("URL: ", this.imageUrl)
    this.currentPosition=currentPosition_;

  }

  //fix!!! correct list of ids 34 in total
  idToName(id){
    switch (id)
    {
      case 1:
        return "burialdec";
      case 2:
        return "chisel";
      case 3:
        return "entrance";
      case 4:
        return "hammer";
      case 5:
        return "lever";
      case 6:
        return "obeliskdec";
      case 7:
        return "pyramiddec";
      case 8:
        return "sail";
      case 9:
        return "sacophagus";
      case 10:
        return "statues";
      case 11:
        return "templedec"
      default:
        alert("Error from market-card.ts: idToName(id)");
        return null;
    }
  }



}
