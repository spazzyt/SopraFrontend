import {ShipSlot} from "./ship-slot";

export class Ship {

  //Backend attributes
  //==================



  //Additional Frontend attributes
  //==============================

  //unique identifier
  public id:number=-1;

  //number of slots
  public size:number=-1;

  //minimum number of stones needed to sail
  public minStones:number=-1;

  //array of slot objects
  public slots:ShipSlot[] = [];

  //ship image
  public imageUrl:string="";

  constructor(id_:number, size_:number, minStones_?:number){
    //initialize attributes
    this.id=id_;
    this.size=size_;
    this.minStones=this.fmin(minStones_);
    this.imageUrl = "../../../assets/images/ship_" + size_ + ".png"
    this.slots=new Array<ShipSlot>(size_);

  }
  fmin(minStones):number{
    if (minStones===null){
      if(this.size==1){
        return 1;
      }
      else{
        return this.size - 1;
      }
    }
  }
}
