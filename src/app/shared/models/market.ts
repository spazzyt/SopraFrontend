import {MarketSlot} from "./market-slot";

export class Market {

  //Backend attributes
  //==================



  //Additional Frontend attributes
  //==============================

  //unique identifier
  public id:number=-1;

  //array of slot objects
  public slots:MarketSlot[] = [];

  constructor(id_:number){

    //initialize attributes
    this.id=id_;
    this.slots=new Array<MarketSlot>(4);

  }

}
