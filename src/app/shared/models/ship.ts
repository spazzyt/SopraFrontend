import {ShipSlot} from "./ship-slot";
import {PositionEnum} from "./position.enum";
import {Stone} from "./stone";

export class Ship {

  //Backend attributes
  //==================

  public draggable = false;

  //Additional Frontend attributes
  //==============================

  isInHarbour: boolean = true;

  //unique identifier
  public id:number=-1;

  //number of slots
  public size:number=-1;

  //minimum number of stones needed to sail
  public minStones:number=-1;

  //array of slot objects
  public slots:Stone[];

  //ship image
  public imageUrl:string="";

  //current position
  public currentPosition:PositionEnum;

  constructor(id_:number, size_:number, minStones_?:number){
    //initialize attributes
    this.id=id_;
    this.size=size_;

    //calculate min stones
    if(this.size==1){
      this.minStones = 1;
    }
    else{
      this.minStones = this.size-1;
    }
    this.imageUrl = "../../../assets/images/ship_" + size_ + ".png"
    this.slots=new Array<Stone>(size_);

  }




  addStoneById(stone: Stone, slot: number){
    this.slots[slot] = stone;

    let counter = 0;
    for(let stone of this.slots){
      if(stone != null){
        counter += 1;
      }
    }

    if(counter >= this.minStones)
      this.draggable = true;
    else
      this.draggable = false;

    console.log(this);
  }
}
