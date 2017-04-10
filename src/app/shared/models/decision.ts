import {Action} from "./action";
import {User} from "./user";

export class Decision {

  //Backend attributes
  //==================
  public id:number=-1;
  public activePlayer: User;
  public actions: Action[]=[];


  //Additional Frontend attributes
  //==============================
  constructor(id_:number, activePlayer_:User, actions_:Action[]){
    this.id=id_;
    this.activePlayer=activePlayer_;
    this.actions=actions_;
  }


}
