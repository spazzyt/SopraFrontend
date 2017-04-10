import {Move} from "./move";
import {ActionEnum} from "./action.enum";

export class Action {

  //Backend attributes
  //==================
  public id:number=-1;
  public actionName:ActionEnum;
  public moves: Move[]=[];


  //Additional Frontend attributes
  //==============================

  constructor(){
  }

}
