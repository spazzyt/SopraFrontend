import {Action} from "./action";
import {User} from "./user";
import {ColourEnum} from "./colour.enum";

export class Decision {

  //Backend attributes
  //==================
  //id[0]: reserved for backend
  //id[1]: reserved for black
  //id[2]: reserved for white
  //id[3]: reserved for brown
  //id[4]: reserved for gray
  public id:number[]=[];

  //frontend sends his made Decision to backend and backend broadcasts decision to all players
  public decisionMadeBy:ColourEnum;
  public whoMadeWhatDecisionSnackbarMessage:string;
  public madeAction:Action;

  //backend sends allowed actions/moves
  public currentActivePlayer: User;
  public allowedActions: Action[]=[];


  //Additional Frontend attributes
  //==============================


  //Constructor
  //==============================
  constructor(id_:number[], decisionMadeBy_:ColourEnum, whoMadeWhatDecisionSnackbarMessage_?:string,
              madeAction_?:Action, activePlayer_?:User, actions_?:Action[]){
    this.id=id_;
    this.decisionMadeBy=decisionMadeBy_;
    this.whoMadeWhatDecisionSnackbarMessage=whoMadeWhatDecisionSnackbarMessage_;
    this.madeAction=madeAction_;

    this.currentActivePlayer=activePlayer_;
    this.allowedActions=actions_;
  }


}
