import {Move} from "./move";

export class Action {

  //Backend attributes
  //==================
  public id:number=-1;
  public actionName:string="";
  public moves: Move[]=[];


  //Additional Frontend attributes
  //==============================

  constructor(){
  }

}
