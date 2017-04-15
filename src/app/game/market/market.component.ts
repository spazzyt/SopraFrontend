import {Component, OnInit, EventEmitter, Output} from '@angular/core';
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


  //==============
  // Event Emitter
  //==============

  @Output() onEvent_setClickHandlerOnBlueMarketCards_bll_1_marketCards = new EventEmitter<number[]>();

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
  chooseMarketCardOnClick(){}

  //Unused market cards will be removed after each round
  removeUnusedMarketCards(){
    this.marketCards = [];
  }


  //Generate four new market cards
  generateFourMarketCards(cards: MarketCard[]){
    this.marketCards = cards;

  }

  //===========================================================
  // Click Events
  //===========================================================


  setClickHandlerOnMarketCards() {

    //set click handler for  bll_1
    (<any>$(document)).ready(() =>{
      (<any>$("#market_card_1")).on("click", () =>{
        alert("You clicked market card in slot 1.");
      });
    });

    //set click handler for  bml_1
    (<any>$(document)).ready(() =>{
      (<any>$("#market_card_2")).on("click", () =>{
        alert("You clicked market card in slot 2.");
      })
    });

    //set click handler for  bmr_1
    (<any>$(document)).ready(() =>{
      (<any>$("#market_card_3")).on("click", () =>{
        alert("You clicked market card in slot 3.");
      })
    });

    //set click handler for  brr_1
    (<any>$(document)).ready(() =>{
      (<any>$("#market_card_4")).on("click", () =>{
        alert("You clicked market card in slot 4.");
      })
    });
  }

  removeClickHandlerOnMarketCards(){

    //remove click handler for  bll_1
    (<any>$(document)).ready(function () {
      (<any>$("#market_card_1")).off("click");
    });

    //remove click handler for  bml_1
    (<any>$(document)).ready(function () {
      (<any>$("#market_card_2")).off("click");
    });

    //remove click handler for  bmr_1
    (<any>$(document)).ready(function () {
      (<any>$("#market_card_3")).off("click");
    });

    //remove click handler for  brr_1
    (<any>$(document)).ready(function () {
      (<any>$("#market_card_4")).off("click");
    });

  }

}



