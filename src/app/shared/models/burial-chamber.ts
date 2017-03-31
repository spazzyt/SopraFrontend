import {SiteSlot} from "./site-slot";

export class BurialChamber {

  //Backend attributes
  //==================



  //Additional Frontend attributes
  //==============================

  //unique identifier
  public id:number=-1;

  //array of slot objects
  public slots:SiteSlot[] = [];

  constructor(id_:number){

    //initialize attributes
    this.id=id_;
    this.slots=new Array<SiteSlot>(26);

  }

}
