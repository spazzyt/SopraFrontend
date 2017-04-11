import {User} from "./user";
import {Stone} from "./stone";
import {Position, PositionEnum} from "./position.enum";
import {ColourEnum} from "./colour.enum";

export class StoneQuarry {

  //Backend attributes
  //==================
  stones:Stone[]=[];
  colour:ColourEnum;
  player:User;


  //Additional Frontend attributes
  //==============================




  constructor(numberOfStones_:number, startId_:number, colour_:ColourEnum, player_:User){

    if(1){console.log("instantiate stone quarry: ", numberOfStones_, startId_, colour_, player_);}

    this.colour=colour_;
    this.player=player_;
    this.generateStones(numberOfStones_, startId_)

  }

  generateStones(numberOfStones_, startId_){

    for(let i=0; i<numberOfStones_; i++){

      if(1){console.log("instantiate stone quarry, instantiate stones: ",
                          numberOfStones_, startId_, this.stones);}

      this.stones.push(new Stone(startId_+i, this.colour, PositionEnum.stoneQuarry));
    }
  }

}
