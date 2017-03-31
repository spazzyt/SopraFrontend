import {Stone} from "./stone";

export class SiteSlot {

  //Backend attributes
  //==================



  //Additional Frontend attributes
  //==============================

  //unique identifier
  public id:number=-1;

  //occupied by a stone
  hasStone:boolean=false;

  //stone
  public stonePlaced:Stone=null;

  //number of stones placed (temple)
  public numberOfTempleStones:number=0;

  constructor(id_:number, numberOfTempleStones_?:number, stonePlaced_?:Stone){

    //initialize attributes
    this.id=id_;
    this.stonePlaced=stonePlaced_;
    this.hasStone= !this.isEmpty(this.stonePlaced);
    this.numberOfTempleStones=numberOfTempleStones_;

    console.log("hasStone ", this.hasStone);
  }

  isEmpty(stone):boolean{
    if (stone===null){
      console.log("stone === null ");
      return true;
    }
    else{
      console.log("stone != null ");
      return false;
    }
  }

}
