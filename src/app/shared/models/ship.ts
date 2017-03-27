import {ShipSlot} from "./ship-slot";
export class Ship {
  slots:ShipSlot[] = [];
  imageUrl:string;

  constructor(public size:number, public color?:string){
    this.imageUrl = "../../../assets/images/ship_"+size+".png"
  }
}
