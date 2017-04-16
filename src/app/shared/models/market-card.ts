
export class MarketCard {

  //Backend attributes
  //==================



  //Additional Frontend attributes
  //==============================

  //unique identifier
  public id:number=-1;

  //card name
  public name:string="";

  //card colour
  public colour:string="";

  //where it is
  public currentPosition:string="";

  //stone image
  public imageUrl:string="";

  //constructor
  constructor(id_?:number, currentPosition_?:string){

    //initialize attributes
    this.id=id_;
    this.name=this.idToName(id_);
    this.colour=this.idToColour(id_);
    this.imageUrl = "../../../assets/images/cards/" + this.name + ".png"
    //console.log("URL: ", this.imageUrl)
    this.currentPosition=currentPosition_;

  }

  idToName(id){
    switch (id)
    {
      case 1:
        return "pavedpath";
      case 2:
        return "pavedpath";
      case 3:
        return "sarcophagus";
      case 4:
        return "sarcophagus";
      case 5:
        return "entrance";
      case 6:
        return "entrance";
      case 7:
        return "pyramiddec";
      case 8:
        return "pyramiddec";
      case 9:
        return "templedec";
      case 10:
        return "templedec";
      case 11:
        return "burialdec";
      case 12:
        return "burialdec";
      case 13:
        return "obeliskdec";
      case 14:
        return "obeliskdec";
      case 15:
        return "statue";
      case 16:
        return "statue";
      case 17:
        return "statue";
      case 18:
        return "statue";
      case 19:
        return "statue";
      case 20:
        return "statue";
      case 21:
        return "statue";
      case 22:
        return "statue";
      case 23:
        return "statue";
      case 24:
        return "statue";
      case 25:
        return "chisel";
      case 26:
        return "chisel";
      case 27:
        return "chisel";
      case 28:
        return "lever";
      case 29:
        return "lever";
      case 30:
        return "hammer";
      case 31:
        return "hammer";
      case 32:
        return "sail";
      case 33:
        return "sail";
      case 34:
        return "sail";
      default:
        alert("Error from market-card.ts: idToName(id)");
        return null;
    }

  }


  idToColour(id) {
    switch (id) {
      case 1:
        return "red";
      case 2:
        return "red";
      case 3:
        return "red";
      case 4:
        return "red";
      case 5:
        return "red";
      case 6:
        return "red";
      case 7:
        return "green";
      case 8:
        return "green";
      case 9:
        return "green";
      case 10:
        return "green";
      case 11:
        return "green";
      case 12:
        return "green";
      case 13:
        return "green";
      case 14:
        return "green";
      case 15:
        return "violet";
      case 16:
        return "violet";
      case 17:
        return "violet";
      case 18:
        return "violet";
      case 19:
        return "violet";
      case 20:
        return "violet";
      case 21:
        return "violet";
      case 22:
        return "violet";
      case 23:
        return "violet";
      case 24:
        return "violet";
      case 25:
        return "blue";
      case 26:
        return "blue";
      case 27:
        return "blue";
      case 28:
        return "blue";
      case 29:
        return "blue";
      case 30:
        return "blue";
      case 31:
        return "blue";
      case 32:
        return "blue";
      case 33:
        return "blue";
      case 34:
        return "blue";
      default:
        alert("Error from market-card.ts: idToName(id)");
        return null;
    }

  }

}
