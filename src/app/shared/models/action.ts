import {Move} from "./move";
import {ActionEnum} from "./action.enum";

export class Action {

  //Backend attributes
  //==================
  public id:number=-1;
  public actionName:ActionEnum;
  public actionName2:ActionEnum;
  public actionName3:ActionEnum;
  public moves: Move[]=[];


  //Additional Frontend attributes
  //==============================

  constructor(){
  }

}
