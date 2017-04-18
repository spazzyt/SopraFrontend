/**
 * Created by davidwyss on 12.04.17.
 */
import {Ship} from "./ship";
import {MarketCard} from "./market-card";

export class Round {

  //Backend attributes
  //==================

  // round number (1-6)
  public roundNumber:number;

  //ships in each round
  public ships:Ship[];

  //market cards in each round
  public marketCards:MarketCard[];


  //Additional Frontend attributes
  //==============================


  //Constructor
  //===========


  constructor(roundNumber_:number,
              ships_:Ship[],
              marketCards_:MarketCard[]){

    this.roundNumber=roundNumber_;
    this.ships=ships_;
    this.marketCards=marketCards_;

  }
}






