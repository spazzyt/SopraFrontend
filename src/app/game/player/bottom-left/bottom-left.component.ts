import { Component, OnInit } from '@angular/core';
import {Stone} from "../../../shared/models/stone";

@Component({
  selector: 'app-bottom-left',
  templateUrl: './bottom-left.component.html',
  styleUrls: ['./bottom-left.component.css']
})

//===========
// Component
//===========
export class BottomLeftComponent implements OnInit {

  //===============
  //Class Variables
  //===============

  // the player's name
  playerName:string;

  // the player's score
  score:number;

  // the player's colour
  playerFieldStone:Stone;

  // the player's stones in supply-sled
  sledStones:number;

  // the player's stones in quarry
  quarryStones:number;

  // the player's nine market card icons
  marketCardIcon_0:number;
  marketCardIcon_1:number;
  marketCardIcon_2:number;
  marketCardIcon_3:number;
  marketCardIcon_4:number;
  marketCardIcon_5:number;
  marketCardIcon_6:number;
  marketCardIcon_7:number;
  marketCardIcon_8:number;


  //===============
  //Constructor
  //===============
  constructor() {

  }


  //==========
  // ngOnInit
  //==========

  ngOnInit() {

    this.initializePopovers();
    this.playerFieldStone = new Stone(0, 'brown')
  }

  //================
  // ngAfterViewInit
  //================

  ngAfterViewInit() {

    this.show_hide_stone_at_init()
  }

  //===============
  // Other-Methods
  //===============

  setPlayerName(playerName_target:string){

    //update attribute: score
    this.playerName=playerName_target;

  }

  setMarketCards(marketCards_target:number[]){

    // define protocol: which market card
    // corresponds to which array index

    this.marketCardIcon_0=marketCards_target[0];
    this.marketCardIcon_1=marketCards_target[1];
    this.marketCardIcon_2=marketCards_target[2];
    this.marketCardIcon_3=marketCards_target[3];
    this.marketCardIcon_4=marketCards_target[4];
    this.marketCardIcon_5=marketCards_target[5];
    this.marketCardIcon_6=marketCards_target[6];
    this.marketCardIcon_7=marketCards_target[7];
    this.marketCardIcon_8=marketCards_target[8];
}

  setScore(score_target:number){

    //update attribute: score
    this.score=score_target;

  }

  setStonesInSled(sledStones_target:number){

    //update attribute: sledStones
    this.sledStones=sledStones_target;

  }

  setStonesInQuarry(quarryStones_target:number){

    // update attribute:
    this.quarryStones=quarryStones_target;

  }

  show_hide_stone_at_init() {
    (<any>$(document)).ready(function () {
      (<any>$("#stones_1")).hide();
      (<any>$("#stone_label")).show();
    });
  }

  show_hide_stone_onMouseOver(){
    (<any>$(document)).ready(function () {
      (<any>$("#stones_1")).show();
      (<any>$("#stone_label")).hide();
    });
  }

  show_hide_stone_onMouseLeave(){
    (<any>$(document)).ready(function () {
      (<any>$("#stone_label")).show();
    });
  }



  //================
  // Popover-Methods
  //================

  initializePopovers(){

    //From bottom-left-left
    (<any>$('#bll_1')).popover({
      placement: 'top',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 500, hide: 500}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px" src="../../../../assets/images/cards/chisel.png"/>'
    });


    //From bottom-middle-left
    (<any>$('#bml_1')).popover({
      placement: 'top',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 500, hide: 500}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px" src="../../../../assets/images/cards/hammer.png"/>'
    });


    //From bottom-middle-right
    (<any>$('#bmr_1')).popover({
      placement: 'top',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 500, hide: 500}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px" src="../../../../assets/images/cards/sail.png"/>'
    });

    //From bottom-right-right
    (<any>$('#brr_1')).popover({
      placement: 'top',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 500, hide: 500}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px" src="../../../../assets/images/cards/lever.png"/>'
    });

    //From purple-card
    (<any>$('#purple_1')).popover({
      placement: 'top',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 500, hide: 500}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px" src="../../../../assets/images/cards/statues.png"/>'
    });

    //From top-left-left
    (<any>$('#tll_1')).popover({
      placement: 'top',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 500, hide: 500}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px" src="../../../../assets/images/cards/pyramiddec.png"/>'
    });

    //From top-middle-left
    (<any>$('#tml_1')).popover({
      placement: 'top',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 500, hide: 500}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px" src="../../../../assets/images/cards/templedec.png"/>'
    });

    //From top-middle-right
    (<any>$('#tmr_1')).popover({
      placement: 'top',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 500, hide: 500}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px" src="../../../../assets/images/cards/burialdec.png"/>'
    });

    //From top-right-right
    (<any>$('#trr_1')).popover({
      placement: 'top',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 500, hide: 500}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px" src="../../../../assets/images/cards/obeliskdec.png"/>'
    });

  }

}
