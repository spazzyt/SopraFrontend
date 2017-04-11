import {User} from "./user";
import {Stone} from "./stone";
import {Position, PositionEnum} from "./position.enum";
import {Colour, ColourEnum} from "./colour.enum";


export class SupplySled {

  //Backend attributes
  //==================
  stones:Stone[]=[];
  colour:ColourEnum;
  player:User;


  //Additional Frontend attributes
  //==============================

  constructor(numberOfStones_:number, startId_:number, colour_:ColourEnum, player_:User){

    this.colour=colour_;
    this.player=player_;
    this.generateStones(numberOfStones_, startId_)

  }

  generateStones(numberOfStones_, startId_){

    for(let i=0; i<numberOfStones_; i++){
      this.stones.push(new Stone(startId_+i, this.colour, PositionEnum.supplySled));

    }
  }

}
