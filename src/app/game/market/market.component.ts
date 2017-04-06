import { Component, OnInit } from '@angular/core';
import {MarketCard} from "../../shared/models/market-card";
import {Position} from "../../shared/models/position.enum"

@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.css']
})
export class MarketComponent implements OnInit {

  //===============
  //Class Variables
  //===============
  marketCards:MarketCard[] = [];

  //===============
  //Constructor
  //===============
  constructor() {

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
      content : '<p>For each stone delivered here, the owner of the stone can immediately take any 1 face-up market card.</p>'
    });

    //RemoveOldMarketCards
    this.removeUnusedMarketCards();

    //generate this.ships array with four ship objects
    this.generateFourMarketCards();

  }


  //===============
  //Class Methods
  //===============

  //User chooses a market card
  chooseMarketCardOnClick(){}

  //Unused market cards will be removed after each round
  removeUnusedMarketCards(){
    this.marketCards = [];
  }


  //Generate four new market cards
  generateFourMarketCards(){

    //Fake maket cards
    let marketCard1 = new MarketCard(1);
    let marketCard2 = new MarketCard(2);
    let marketCard3 = new MarketCard(3);
    let marketCard4 = new MarketCard(4);

    //fill market cards array
    this.marketCards.push(marketCard1);
    this.marketCards.push(marketCard2);
    this.marketCards.push(marketCard3);
    this.marketCards.push(marketCard4);
  }



  deactivateOrActivateMarketCards(){

  }

}



