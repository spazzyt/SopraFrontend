import {Move} from "./move";
import {ActionEnum} from "./action.enum";

export class Action {

  //Backend attributes
  //==================
  public id:number=-1;
  public actionName:ActionEnum;
  public actionName2:ActionEnum;
  public actionName3:ActionEnum;

  //additional data to be sent from
  //active player to inactive players
  public data:any;
  public data2:any;
  public data3:any;
  public data4:any;
  public data5:any;

  //frontend sends his made Decision to backend and backend broadcasts decision to all players
  public madeMove:Move= new Move();

  //backend sends allowed actions/moves
  public moves: Move[]=[];


  //Additional Frontend attributes
  //==============================

  constructor(id_?:number, actionName_?:ActionEnum, actionName2_?:ActionEnum, actionName3_?:ActionEnum,
              moves_?:Move[], madeMove_?:Move){
    this.id=id_;
    this.actionName=actionName_;
    this.actionName2=actionName2_;
    this.actionName3=actionName3_;
    this.moves=moves_;
    this.madeMove=madeMove_;
  }

}
