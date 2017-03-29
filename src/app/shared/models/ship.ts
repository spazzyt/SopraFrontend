import {ShipSlot} from "./ship-slot";

export class Ship {

  //unique identifier
  public id:number;

  //number of slots
  public size:number;

  //minimum number of stones needed to sail
  public minStones:number;

  //array of slot objects
  public slots:ShipSlot[] = [];

  //ship image
  public imageUrl:string;

  constructor(id_:number, size_:number, minStones_?:number){
    //initialize attributes
    this.id=id_;
    this.size=size_;
    this.minStones=minStones_;
    this.imageUrl = "../../../assets/images/ship_" + size_ + ".png"
  }
}
