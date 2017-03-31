import {MarketCard} from "./market-card";

export class MarketSlot {

  //Backend attributes
  //==================



  //Additional Frontend attributes
  //==============================

  //unique identifier
  public id:number=-1;

  //occupied by a card
  hasCard:boolean=false;

  //card
  public cardPlaced:MarketCard=null;

  constructor(id_:number, cardPlaced_?:MarketCard){

    //initialize attributes
    this.id=id_;
    this.cardPlaced=cardPlaced_;
    this.hasCard= !this.isEmpty(this.cardPlaced);

    console.log("MarketSlot: hasCard ", this.hasCard);
  }

  isEmpty(card):boolean{
    if (card===null){
      console.log("MarketSlot: card === null ");
      return true;
    }
    else{
      console.log("MarketSlot: card != null ");
      return false;
    }
  }

}
