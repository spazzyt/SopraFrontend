export class Move {

  //Backend attributes
  //==================
  public id:number=-1;
  public from:string;
  public to:string;
  public pos:number; //check with backend about usage


  //Additional Frontend attributes
  //==============================

  constructor(id_:number, from_:string, to_:string, pos_:number){

    this.id=id_;
    this.from=from_;
    this.to=to_;
    this.pos=pos_;

  }


}



