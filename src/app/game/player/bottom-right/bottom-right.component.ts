import { Component, OnInit } from '@angular/core';
import {Stone} from "../../../shared/models/stone";
import {ColourEnum} from "../../../shared/models/colour.enum";

@Component({
  selector: 'app-bottom-right',
  templateUrl: './bottom-right.component.html',
  styleUrls: ['./bottom-right.component.css']
})


//===========
// Component
//===========
export class BottomRightComponent implements OnInit {


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
  marketCards:number[] = [0,0,0,0,0,0,0,0,0];


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
    this.playerFieldStone = new Stone(0, ColourEnum.brown)
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

    for(var i = 0; i < marketCards_target.length; i++){
      this.marketCards[i] = marketCards_target[i];
    }
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
      (<any>$("#stones_4")).hide();
      (<any>$("#stone_label_4")).show();
    });
  }

  show_hide_stone_onMouseOver(){
    (<any>$(document)).ready(function () {
      (<any>$("#stones_4")).show();
      (<any>$("#stone_label_4")).hide();
    });
  }

  show_hide_stone_onMouseLeave(){
    (<any>$(document)).ready(function () {
      (<any>$("#stone_label_4")).show();
    });
  }


  setClickHandlerOnBlueMarketCards() {

    //set click handler for  bll_4


    //set click handler for  bml_4


    //set click handler for  bmr_4


    //set click handler for  brr_4

  }

  removeClickHandlerOnBlueMarketCards(){

    //remove click handler for  bll_4


    //remove click handler for  bml_4


    //remove click handler for  bmr_4


    //remove click handler for  brr_4

  }


  //deactivates at the moment the icon top-left-left,
  // this function cannot reactivate icon

  deactivateOrActivateIcons(playerIconsStatus_target){


    //deactivates icons at the bottom of player bottom-left


    if (playerIconsStatus_target[0] == false) {
      (<any>$(document)).ready(function (){
        (<any>$("#bll_4")).css("opacity", "0.3");

      });

      console.log("deactivateOrActivateIcons: false")
    }
    if (playerIconsStatus_target[0] == true){
      (<any>$(document)).ready(function (){
        (<any>$("#bll_4")).css("opacity", "1.0");

      });
      console.log("deactivateOrActivateIcons: true")
    }

    if (playerIconsStatus_target[1] == false) {
      (<any>$(document)).ready(function (){
        (<any>$("#bml_4")).css("opacity", "0.3");

      });

      console.log("deactivateOrActivateIcons: false")
    }
    if (playerIconsStatus_target[1] == true){
      (<any>$(document)).ready(function (){
        (<any>$("#bml_4")).css("opacity", "1.0");

      });
      console.log("deactivateOrActivateIcons: true")
    }

    if (playerIconsStatus_target[2] == false) {
      (<any>$(document)).ready(function (){
        (<any>$("#bmr_4")).css("opacity", "0.3");

      });

      console.log("deactivateOrActivateIcons: false")
    }
    if (playerIconsStatus_target[2] == true){
      (<any>$(document)).ready(function (){
        (<any>$("#bmr_4")).css("opacity", "1.0");

      });
      console.log("deactivateOrActivateIcons: true")
    }

    if (playerIconsStatus_target[3] == false) {
      (<any>$(document)).ready(function (){
        (<any>$("#brr_4")).css("opacity", "0.3");

      });

      console.log("deactivateOrActivateIcons: false")
    }
    if (playerIconsStatus_target[3] == true){
      (<any>$(document)).ready(function (){
        (<any>$("#brr_4")).css("opacity", "1.0");

      });
      console.log("deactivateOrActivateIcons: true")
    }


    //deactivates icons at the top of player bottom-left


    if (playerIconsStatus_target[4] == false) {
      (<any>$(document)).ready(function (){
        (<any>$("#tll_4")).css("opacity", "0.3");

      });

      console.log("deactivateOrActivateIcons: false")
    }
    if (playerIconsStatus_target[4] == true){
      (<any>$(document)).ready(function (){
        (<any>$("#tll_4")).css("opacity", "1.0");

      });
      console.log("deactivateOrActivateIcons: true")
    }

    if (playerIconsStatus_target[5] == false) {
      (<any>$(document)).ready(function (){
        (<any>$("#tml_4")).css("opacity", "0.3");

      });

      console.log("deactivateOrActivateIcons: false")
    }
    if (playerIconsStatus_target[5] == true){
      (<any>$(document)).ready(function (){
        (<any>$("#tml_4")).css("opacity", "1.0");

      });
      console.log("deactivateOrActivateIcons: true")
    }

    if (playerIconsStatus_target[6] == false) {
      (<any>$(document)).ready(function (){
        (<any>$("#tmr_4")).css("opacity", "0.3");

      });

      console.log("deactivateOrActivateIcons: false")
    }
    if (playerIconsStatus_target[6] == true){
      (<any>$(document)).ready(function (){
        (<any>$("#tmr_4")).css("opacity", "1.0");

      });
      console.log("deactivateOrActivateIcons: true")
    }

    if (playerIconsStatus_target[7] == false) {
      (<any>$(document)).ready(function (){
        (<any>$("#trr_4")).css("opacity", "0.3");

      });

      console.log("deactivateOrActivateIcons: false")
    }
    if (playerIconsStatus_target[7] == true){
      (<any>$(document)).ready(function (){
        (<any>$("#trr_4")).css("opacity", "1.0");

      });
      console.log("deactivateOrActivateIcons: true")
    }


    //deactivates purple icon of player bottom-left


    if (playerIconsStatus_target[8] == false) {
      (<any>$(document)).ready(function (){
        (<any>$("#purple_4")).css("opacity", "0.3");

      });

      console.log("deactivateOrActivateIcons: false")
    }
    if (playerIconsStatus_target[8] == true){
      (<any>$(document)).ready(function (){
        (<any>$("#purple_4")).css("opacity", "1.0");

      });
      console.log("deactivateOrActivateIcons: true")
    }

  }

  deactivateOrActivateStoneQuarry(playerStoneQuarryStatus_target){

  }

  deactivateOrActivateStoneSled(playerStoneSledStatus_target){

  }

  deactivateOrActivatePlayerField(playerPlayerFieldStatus_target){

  }


  //================
  // Popover-Methods
  //================

  initializePopovers(){

    //From bottom-left-left
    (<any>$('#bll_4')).popover({
      placement: 'top',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 500, hide: 500}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px" src="../../../../assets/images/cards/chisel.png"/>'
    });


    //From bottom-middle-left
    (<any>$('#bml_4')).popover({
      placement: 'top',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 500, hide: 500}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px" src="../../../../assets/images/cards/hammer.png"/>'
    });


    //From bottom-middle-right
    (<any>$('#bmr_4')).popover({
      placement: 'top',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 500, hide: 500}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px" src="../../../../assets/images/cards/sail.png"/>'
    });

    //From bottom-right-right
    (<any>$('#brr_4')).popover({
      placement: 'top',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 500, hide: 500}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px" src="../../../../assets/images/cards/lever.png"/>'
    });

    //From purple-card
    (<any>$('#purple_4')).popover({
      placement: 'top',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      sdelay: {show: 500, hide: 500}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px" src="../../../../assets/images/cards/statues.png"/>'
    });

    //From top-left-left
    (<any>$('#tll_4')).popover({
      placement: 'top',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 500, hide: 500}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px" src="../../../../assets/images/cards/pyramiddec.png"/>'
    });

    //From top-middle-left
    (<any>$('#tml_4')).popover({
      placement: 'top',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 500, hide: 500}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px" src="../../../../assets/images/cards/templedec.png"/>'
    });

    //From top-middle-right
    (<any>$('#tmr_4')).popover({
      placement: 'top',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 500, hide: 500}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px" src="../../../../assets/images/cards/burialdec.png"/>'
    });

    //From top-right-right
    (<any>$('#trr_4')).popover({
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
