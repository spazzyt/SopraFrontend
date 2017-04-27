import {Component, OnInit, EventEmitter, Output, Input} from '@angular/core';
import {MarketCard} from "../../shared/models/market-card";
import {Position, PositionEnum} from "../../shared/models/position.enum"
import {Site} from "../../shared/site";
import {Stone} from "../../shared/models/stone";
import {Move} from "../../shared/models/move";
import {GameService} from "../../shared/services/game.service";

@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.css']
})
export class MarketComponent extends Site implements OnInit {



  @Input()
  marketCards: MarketCard[];

  @Input()
  canIPick: boolean;


  //===============
  //Class Variables
  //===============


  //===============
  //Constructor
  //===============
  constructor(private gameService: GameService,) {
    super("Market");
  }

  //===============
  //ngOnInit
  //===============

  ngOnInit() {
    //styles in styles.css at the end under popover, to style:
    //.popover .popover-title .popover-content .arrow

    //hover from top doesn't work properly
    (<any>$('#market')).popover({
      placement: 'top',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 500, hide: 500}, //delay-test for popover hover
      html: true,
      content : '<p>For each stone delivered here, ' +
                    'the owner of the stone can immediately take any 1 face-up market card.</p>'
    });


  }


  //===============
  //Class Methods
  //===============

  //User chooses a market card
  //--------------------------
  takeMarketCard(index: number){

    console.log("PLAYER TRIES TO TAKE CARD " + index)

    if(this.canIPick){  //TODO from game component
      console.log("PLAYER CAN TAKE CARD!!")

      //TODO update player cards

      //generate Move object
      //TODO check if correct ID is delivered
      let moveToSend = new Move(PositionEnum.Market, PositionEnum.PlayerCardStack, this.marketCards[index].id);
      //Send move to backend
      this.gameService.sendMove(moveToSend);
    }

  }



  //This function is just here because the parent model (site) requires it
  placeStones(targetStones: Stone[]){
    console.log("a ship has sailed to the market!");
  }
}



