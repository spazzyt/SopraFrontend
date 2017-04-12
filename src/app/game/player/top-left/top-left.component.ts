import { Component, OnInit } from '@angular/core';
import {Stone} from "../../../shared/models/stone";
import {ColourEnum} from "../../../shared/models/colour.enum";
import {SupplySled} from "../../../shared/models/supply-sled";
import {StoneQuarry} from "../../../shared/models/stone-quarry";

@Component({
  selector: 'app-top-left',
  templateUrl: './top-left.component.html',
  styleUrls: ['./top-left.component.css']
})

//===========
// Component
//===========
export class TopLeftComponent implements OnInit {


  //===============
  //Class Variables
  //===============

  // stone quarry object: contains stone objects
  public stoneQuarry: StoneQuarry;

  // supply sled object: contains stone objects
  public supplySled: SupplySled;

  // the player's name
  public playerName:string;

  // the player's score
  public score:number;

  // stone generated in supply sled
  // (used by dragula to copy)
  public playerFieldStone:Stone;

  // the player's stones in supply-sled
  public sledStones:number;

  // the player's stones in quarry
  public quarryStones:number;

  // the player's nine market card icons
  public marketCards:number[] = [];


  //===============
  //Constructor
  //===============
  constructor() {

  }


  //==========
  // ngOnInit
  //==========

  ngOnInit() {

    //Popovers must be initialized in ngOnInit()
    this.initializePopovers();

    // stone generated in supply sled
    // (used by dragula to copy)
    this.playerFieldStone = new Stone(30, ColourEnum.white);
    console.log("ColourEnum: ", ColourEnum.white);

  }

  //===============
  // Other-Methods
  //===============

  setPlayerName(playerName_target:string){

    //update attribute: score
    this.playerName=playerName_target;

  }

  playerFieldGlow(status: boolean) {
    (<any>$(document)).ready(function () {
      if(status)
        (<any>$("#glow2")).css("background-image", "url(../../assets/images/top_left_active.png)");
      else
        (<any>$("#glow2")).css("background-image", "url(../../assets/images/top_left.png)");
    });
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
    //this.playerFieldStone = new Stone(0, ColourEnum.white)

  }


  show_hide_stone_at_init() {
    /**(<any>$(document)).ready(function () {
      (<any>$("#stones_2")).hide();
      (<any>$("#stone_label_2")).show();
    });
     */
  }

  show_hide_stone_onMouseOver(){
    /**(<any>$(document)).ready(function () {
      (<any>$("#stones_2")).show();
      (<any>$("#stone_label_2")).hide();
    });*/
  }

  show_hide_stone_onMouseLeave(){
    /**(<any>$(document)).ready(function () {
      (<any>$("#stone_label_2")).show();
    });*/
  }


  setClickHandlerOnBlueMarketCards() {

    //set click handler for  bll_2
    (<any>$(document)).ready(() =>{
      (<any>$("#bll_2_")).on("click", () =>{
        alert("The chisel was clicked."); this.marketCards[5]-=1;
      });
    });

    //set click handler for  bml_2
    (<any>$(document)).ready(() =>{
      (<any>$("#bml_2_")).on("click", () =>{
        alert("The hammer was clicked."); this.marketCards[6]-=1;
      })
    });

    //set click handler for  bmr_2
    (<any>$(document)).ready(() =>{
      (<any>$("#bmr_2_")).on("click", () =>{
        alert("The sail was clicked."); this.marketCards[7]-=1;
      })
    });

    //set click handler for  brr_2
    (<any>$(document)).ready(() =>{
      (<any>$("#brr_2_")).on("click", () =>{
        alert("The lever was clicked."); this.marketCards[8]-=1;
      })
    });
  }

  removeClickHandlerOnBlueMarketCards(){

    //remove click handler for  bll_2
    (<any>$(document)).ready(function () {
      (<any>$("#bll_2_")).off("click");
    });

    //remove click handler for  bml_2
    (<any>$(document)).ready(function () {
      (<any>$("#bml_2_")).off("click");
    });

    //remove click handler for  bmr_2
    (<any>$(document)).ready(function () {
      (<any>$("#bmr_2_")).off("click");
    });

    //remove click handler for  brr_2
    (<any>$(document)).ready(function () {
      (<any>$("#brr_2_")).off("click");
    });

  }


  //deactivates at the moment the icon top-left-left,
  // this function cannot reactivate icon

  deactivateOrActivateIcons(playerIconsStatus_target){


    //deactivates icons at the bottom of player bottom-left


    if (playerIconsStatus_target[0] == false) {
      (<any>$(document)).ready(function (){
        (<any>$("#bll_2")).css("opacity", "0.3");

      });

      console.log("deactivateOrActivateIcons: false")
    }
    if (playerIconsStatus_target[0] == true){
      (<any>$(document)).ready(function (){
        (<any>$("#bll_2")).css("opacity", "1.0");

      });
      console.log("deactivateOrActivateIcons: true")
    }

    if (playerIconsStatus_target[1] == false) {
      (<any>$(document)).ready(function (){
        (<any>$("#bml_2")).css("opacity", "0.3");

      });

      console.log("deactivateOrActivateIcons: false")
    }
    if (playerIconsStatus_target[1] == true){
      (<any>$(document)).ready(function (){
        (<any>$("#bml_2")).css("opacity", "1.0");

      });
      console.log("deactivateOrActivateIcons: true")
    }

    if (playerIconsStatus_target[2] == false) {
      (<any>$(document)).ready(function (){
        (<any>$("#bmr_2")).css("opacity", "0.3");

      });

      console.log("deactivateOrActivateIcons: false")
    }
    if (playerIconsStatus_target[2] == true){
      (<any>$(document)).ready(function (){
        (<any>$("#bmr_2")).css("opacity", "1.0");

      });
      console.log("deactivateOrActivateIcons: true")
    }

    if (playerIconsStatus_target[3] == false) {
      (<any>$(document)).ready(function (){
        (<any>$("#brr_2")).css("opacity", "0.3");

      });

      console.log("deactivateOrActivateIcons: false")
    }
    if (playerIconsStatus_target[3] == true){
      (<any>$(document)).ready(function (){
        (<any>$("#brr_2")).css("opacity", "1.0");

      });
      console.log("deactivateOrActivateIcons: true")
    }


    //deactivates icons at the top of player bottom-left


    if (playerIconsStatus_target[4] == false) {
      (<any>$(document)).ready(function (){
        (<any>$("#tll_2")).css("opacity", "0.3");

      });

      console.log("deactivateOrActivateIcons: false")
    }
    if (playerIconsStatus_target[4] == true){
      (<any>$(document)).ready(function (){
        (<any>$("#tll_2")).css("opacity", "1.0");

      });
      console.log("deactivateOrActivateIcons: true")
    }

    if (playerIconsStatus_target[5] == false) {
      (<any>$(document)).ready(function (){
        (<any>$("#tml_2")).css("opacity", "0.3");

      });

      console.log("deactivateOrActivateIcons: false")
    }
    if (playerIconsStatus_target[5] == true){
      (<any>$(document)).ready(function (){
        (<any>$("#tml_2")).css("opacity", "1.0");

      });
      console.log("deactivateOrActivateIcons: true")
    }

    if (playerIconsStatus_target[6] == false) {
      (<any>$(document)).ready(function (){
        (<any>$("#tmr_2")).css("opacity", "0.3");

      });

      console.log("deactivateOrActivateIcons: false")
    }
    if (playerIconsStatus_target[6] == true){
      (<any>$(document)).ready(function (){
        (<any>$("#tmr_2")).css("opacity", "1.0");

      });
      console.log("deactivateOrActivateIcons: true")
    }

    if (playerIconsStatus_target[7] == false) {
      (<any>$(document)).ready(function (){
        (<any>$("#trr_2")).css("opacity", "0.3");

      });

      console.log("deactivateOrActivateIcons: false")
    }
    if (playerIconsStatus_target[7] == true){
      (<any>$(document)).ready(function (){
        (<any>$("#trr_2")).css("opacity", "1.0");

      });
      console.log("deactivateOrActivateIcons: true")
    }


    //deactivates purple icon of player bottom-left


    if (playerIconsStatus_target[8] == false) {
      (<any>$(document)).ready(function (){
        (<any>$("#purple_2")).css("opacity", "0.3");

      });

      console.log("deactivateOrActivateIcons: false")
    }
    if (playerIconsStatus_target[8] == true){
      (<any>$(document)).ready(function (){
        (<any>$("#purple_2")).css("opacity", "1.0");

      });
      console.log("deactivateOrActivateIcons: true")
    }

  }

  deactivateOrActivateStoneQuarry(playerStoneQuarryStatus_target){

  }

  deactivateOrActivateSupplySled(playerStoneSledStatus_target){

  }

  deactivateOrActivatePlayerField(playerPlayerFieldStatus_target){

  }


  //================
  // Popover-Methods
  //================

  initializePopovers(){

    //From bottom-left-left
    (<any>$('#bll_2')).popover({
      placement: 'bottom',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 500, hide: 500}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px" class="non-draggable" src="../../../../assets/images/cards/chisel.png"/>'
    });


    //From bottom-middle-left
    (<any>$('#bml_2')).popover({
      placement: 'bottom',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 500, hide: 500}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px" src="../../../../assets/images/cards/hammer.png"/>'
    });


    //From bottom-middle-right
    (<any>$('#bmr_2')).popover({
      placement: 'bottom',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 500, hide: 500}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px" class="non-draggable" src="../../../../assets/images/cards/sail.png"/>'
    });

    //From bottom-right-right
    (<any>$('#brr_2')).popover({
      placement: 'bottom',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 500, hide: 500}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px" class="non-draggable" src="../../../../assets/images/cards/lever.png"/>'
    });

    //From purple-card
    (<any>$('#purple_2')).popover({
      placement: 'bottom',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 500, hide: 500}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px" class="non-draggable" src="../../../../assets/images/cards/statues.png"/>'
    });

    //From top-left-left
    (<any>$('#tll_2')).popover({
      placement: 'bottom',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 500, hide: 500}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px" class="non-draggable" src="../../../../assets/images/cards/pyramiddec.png"/>'
    });

    //From top-middle-left
    (<any>$('#tml_2')).popover({
      placement: 'bottom',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 500, hide: 500}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px" class="non-draggable" src="../../../../assets/images/cards/templedec.png"/>'
    });

    //From top-middle-right
    (<any>$('#tmr_2')).popover({
      placement: 'bottom',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 500, hide: 500}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px" class="non-draggable" src="../../../../assets/images/cards/burialdec.png"/>'
    });

    //From top-right-right
    (<any>$('#trr_2')).popover({
      placement: 'bottom',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 500, hide: 500}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px" class="non-draggable" src="../../../../assets/images/cards/obeliskdec.png"/>'
    });


  }

}
