import {Component, OnInit, EventEmitter, Output} from '@angular/core';
import {MarketCard} from "../../shared/models/market-card";
import {Position} from "../../shared/models/position.enum"
import {Site} from "../../shared/site";

@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.css']
})
export class MarketComponent extends Site implements OnInit {

  //===============
  //Class Variables
  //===============
  marketCards:MarketCard[] = [];


  //==============
  // Event Emitter
  //==============

  @Output() onEvent_setClickHandlerOnMarketCards_1_marketCards = new EventEmitter<MarketCard[]>();
  @Output() onEvent_setClickHandlerOnMarketCards_2_marketCards = new EventEmitter<MarketCard[]>();
  @Output() onEvent_setClickHandlerOnMarketCards_3_marketCards = new EventEmitter<MarketCard[]>();
  @Output() onEvent_setClickHandlerOnMarketCards_4_marketCards = new EventEmitter<MarketCard[]>();

  //===============
  //Constructor
  //===============
  constructor() {
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


  //===========================================================
  // Set / Remove Card(s)
  //===========================================================

  //User chooses a market card
  //--------------------------
  chooseMarketCard_1_OnClick(){
    this.marketCards[0]=null;
  }

  chooseMarketCard_2_OnClick(){
    this.marketCards[1]=null;
  }

  chooseMarketCard_3_OnClick(){
    this.marketCards[2]=null;
  }

  chooseMarketCard_4_OnClick(){
    this.marketCards[3]=null;
  }

  //Unused market cards will be removed after each round
  //----------------------------------------------------
  removeUnusedMarketCards(){
    this.marketCards = [];
  }


  //Generate four new market cards
  //------------------------------
  generateFourMarketCards(cards: MarketCard[]){
    this.marketCards = cards;

  }

  //===========================================================
  // Click Events
  //===========================================================


  setClickHandlerOnMarketCards() {

    //set click handler for  1
    (<any>$(document)).ready(() =>{
      (<any>$("#market_card_1")).on("click", () =>{
        //alert("You clicked market card in slot 1.");
        this.removeClickHandlerOnMarketCard1();
        this.onEvent_setClickHandlerOnMarketCards_1_marketCards.emit(this.marketCards);
        //this.chooseMarketCard_1_OnClick(); //not here: generates errors
      });
    });

    //set click handler for  2
    (<any>$(document)).ready(() =>{
      (<any>$("#market_card_2")).on("click", () =>{
        //alert("You clicked market card in slot 2.");
        this.removeClickHandlerOnMarketCard2();
        this.onEvent_setClickHandlerOnMarketCards_2_marketCards.emit(this.marketCards);
        //this.chooseMarketCard_2_OnClick(); //not here: generates errors
      })
    });

    //set click handler for  3
    (<any>$(document)).ready(() =>{
      (<any>$("#market_card_3")).on("click", () =>{
        //alert("You clicked market card in slot 3.");
        this.removeClickHandlerOnMarketCard3();
        this.onEvent_setClickHandlerOnMarketCards_3_marketCards.emit(this.marketCards);
        //this.chooseMarketCard_3_OnClick(); //not here: generates errors
      })
    });

    //set click handler for  4
    (<any>$(document)).ready(() =>{
      (<any>$("#market_card_4")).on("click", () =>{
        //alert("You clicked market card in slot 4.");
        this.removeClickHandlerOnMarketCard4();
        this.onEvent_setClickHandlerOnMarketCards_4_marketCards.emit(this.marketCards);
        //this.chooseMarketCard_4_OnClick(); //not here: generates errors
      })
    });
  }

  removeClickHandlerOnMarketCards(){

    //remove click handler for  1
    (<any>$(document)).ready(function () {
      (<any>$("#market_card_1")).off("click");
    });

    //remove click handler for  2
    (<any>$(document)).ready(function () {
      (<any>$("#market_card_2")).off("click");
    });

    //remove click handler for  3
    (<any>$(document)).ready(function () {
      (<any>$("#market_card_3")).off("click");
    });

    //remove click handler for  4
    (<any>$(document)).ready(function () {
      (<any>$("#market_card_4")).off("click");
    });

  }

  removeClickHandlerOnMarketCard1(){

    //remove click handler for  1
    (<any>$(document)).ready(function () {
      (<any>$("#market_card_1")).off("click");
    });

  }

  removeClickHandlerOnMarketCard2(){

    //remove click handler for  2
    (<any>$(document)).ready(function () {
      (<any>$("#market_card_2")).off("click");
    });

  }

  removeClickHandlerOnMarketCard3(){

    //remove click handler for  3
    (<any>$(document)).ready(function () {
      (<any>$("#market_card_3")).off("click");
    });

  }

  removeClickHandlerOnMarketCard4(){

    //remove click handler for  4
    (<any>$(document)).ready(function () {
      (<any>$("#market_card_4")).off("click");
    });

  }

}



