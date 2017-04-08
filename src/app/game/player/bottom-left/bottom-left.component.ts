import { Component, OnInit } from '@angular/core';
import {Stone} from "../../../shared/models/stone";
import {ColourEnum} from "../../../shared/models/colour.enum";

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

  // stone generated in supply sled
  playerFieldStone:Stone;

  // the player's stones in supply-sled
  sledStones:number;

  // the player's stones in quarry
  quarryStones:number;

  // the player's nine market card icons
  marketCards:number[] = [0,0,0,0,0,0,0,0,0]


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
    this.playerFieldStone = new Stone(0, ColourEnum.brown);
    console.log("ColourEnum: ", ColourEnum.brown);
  }

  //================
  // ngAfterViewInit
  //================

  ngAfterViewInit() {

    this.show_hide_stone_at_init();

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
    for(let i = 0; i < marketCards_target.length; i++){
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
      (<any>$("#stones_1")).hide();
      (<any>$("#stone_label_1")).show();
    });
  }

  show_hide_stone_onMouseOver(){
    (<any>$(document)).ready(function () {
      (<any>$("#stones_1")).show();
      (<any>$("#stone_label_1")).hide();
    });
  }

  show_hide_stone_onMouseLeave(){
    (<any>$(document)).ready(function () {
      (<any>$("#stone_label_1")).show();

    });
  }


  setClickHandlerOnBlueMarketCards() {

    //set click handler for  bll_1
    (<any>$(document)).ready(() =>{
      (<any>$("#bll_1_")).on("click", () =>{
        alert("The chisel was clicked."); this.marketCards[5]-=1;
      });
    });

    //set click handler for  bml_1
    (<any>$(document)).ready(() =>{
      (<any>$("#bml_1_")).on("click", () =>{
        alert("The hammer was clicked."); this.marketCards[6]-=1;
      })
    });

    //set click handler for  bmr_1
    (<any>$(document)).ready(() =>{
      (<any>$("#bmr_1_")).on("click", () =>{
        alert("The sail was clicked."); this.marketCards[7]-=1;
      })
    });

    //set click handler for  brr_1
    (<any>$(document)).ready(() =>{
      (<any>$("#brr_1_")).on("click", () =>{
        alert("The lever was clicked."); this.marketCards[8]-=1;
      })
    });
  }

  removeClickHandlerOnBlueMarketCards(){

    //remove click handler for  bll_1
    (<any>$(document)).ready(function () {
      (<any>$("#bll_1_")).off("click");
    });

    //remove click handler for  bml_1
    (<any>$(document)).ready(function () {
      (<any>$("#bml_1_")).off("click");
    });

    //remove click handler for  bmr_1
    (<any>$(document)).ready(function () {
      (<any>$("#bmr_1_")).off("click");
    });

    //remove click handler for  brr_1
    (<any>$(document)).ready(function () {
      (<any>$("#brr_1_")).off("click");
    });

  }

  //deactivates at the moment the icon top-left-left,
  // this function cannot reactivate icon

  deactivateOrActivateIcons(playerIconsStatus_target){


    //deactivates icons at the bottom of player bottom-left


    if (playerIconsStatus_target[0] == false) {
      (<any>$(document)).ready(function (){
        (<any>$("#bll_1")).css("opacity", "0.3");

      });

      console.log("deactivateOrActivateIcons: false")
    }
    if (playerIconsStatus_target[0] == true){
      (<any>$(document)).ready(function (){
        (<any>$("#bll_1")).css("opacity", "1.0");

      });
      console.log("deactivateOrActivateIcons: true")
    }

    if (playerIconsStatus_target[1] == false) {
      (<any>$(document)).ready(function (){
        (<any>$("#bml_1")).css("opacity", "0.3");

      });

      console.log("deactivateOrActivateIcons: false")
    }
    if (playerIconsStatus_target[1] == true){
      (<any>$(document)).ready(function (){
        (<any>$("#bml_1")).css("opacity", "1.0");

      });
      console.log("deactivateOrActivateIcons: true")
    }

    if (playerIconsStatus_target[2] == false) {
      (<any>$(document)).ready(function (){
        (<any>$("#bmr_1")).css("opacity", "0.3");

      });

      console.log("deactivateOrActivateIcons: false")
    }
    if (playerIconsStatus_target[2] == true){
      (<any>$(document)).ready(function (){
        (<any>$("#bmr_1")).css("opacity", "1.0");

      });
      console.log("deactivateOrActivateIcons: true")
    }

    if (playerIconsStatus_target[3] == false) {
      (<any>$(document)).ready(function (){
        (<any>$("#brr_1")).css("opacity", "0.3");

      });

      console.log("deactivateOrActivateIcons: false")
    }
    if (playerIconsStatus_target[3] == true){
      (<any>$(document)).ready(function (){
        (<any>$("#brr_1")).css("opacity", "1.0");

      });
      console.log("deactivateOrActivateIcons: true")
    }


    //deactivates icons at the top of player bottom-left


    if (playerIconsStatus_target[4] == false) {
      (<any>$(document)).ready(function (){
        (<any>$("#tll_1")).css("opacity", "0.3");

      });

      console.log("deactivateOrActivateIcons: false")
    }
    if (playerIconsStatus_target[4] == true){
      (<any>$(document)).ready(function (){
        (<any>$("#tll_1")).css("opacity", "1.0");

      });
      console.log("deactivateOrActivateIcons: true")
    }

    if (playerIconsStatus_target[5] == false) {
      (<any>$(document)).ready(function (){
        (<any>$("#tml_1")).css("opacity", "0.3");

      });

      console.log("deactivateOrActivateIcons: false")
    }
    if (playerIconsStatus_target[5] == true){
      (<any>$(document)).ready(function (){
        (<any>$("#tml_1")).css("opacity", "1.0");

      });
      console.log("deactivateOrActivateIcons: true")
    }

    if (playerIconsStatus_target[6] == false) {
      (<any>$(document)).ready(function (){
        (<any>$("#tmr_1")).css("opacity", "0.3");

      });

      console.log("deactivateOrActivateIcons: false")
    }
    if (playerIconsStatus_target[6] == true){
      (<any>$(document)).ready(function (){
        (<any>$("#tmr_1")).css("opacity", "1.0");

      });
      console.log("deactivateOrActivateIcons: true")
    }

    if (playerIconsStatus_target[7] == false) {
      (<any>$(document)).ready(function (){
        (<any>$("#trr_1")).css("opacity", "0.3");

      });

      console.log("deactivateOrActivateIcons: false")
    }
    if (playerIconsStatus_target[7] == true){
      (<any>$(document)).ready(function (){
        (<any>$("#trr_1")).css("opacity", "1.0");

      });
      console.log("deactivateOrActivateIcons: true")
    }


    //deactivates purple icon of player bottom-left


    if (playerIconsStatus_target[8] == false) {
      (<any>$(document)).ready(function (){
        (<any>$("#purple_1")).css("opacity", "0.3");

      });

      console.log("deactivateOrActivateIcons: false")
    }
    if (playerIconsStatus_target[8] == true){
      (<any>$(document)).ready(function (){
        (<any>$("#purple_1")).css("opacity", "1.0");

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
