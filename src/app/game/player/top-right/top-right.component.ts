import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import {Stone} from "../../../shared/models/stone";
import {ColourEnum} from "../../../shared/models/colour.enum";
import {SupplySled} from "../../../shared/models/supply-sled";
import {StoneQuarry} from "../../../shared/models/stone-quarry";

@Component({
  selector: 'app-top-right',
  templateUrl: './top-right.component.html',
  styleUrls: ['./top-right.component.css']
})

//===========
// Component
//===========
export class TopRightComponent implements OnInit {


  //===============
  //Class Variables
  //===============

  // stone quarry object: contains stone objects
  public stoneQuarry: StoneQuarry;

  // supply sled object: contains stone objects
  public supplySled: SupplySled;

  // the player's name
  public playerName:string = '.';

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

  // does the player have stones in his sleds
  public hasStones:boolean;


  //==============
  // Event Emitter
  //==============

  @Output() onEvent_setClickHandlerOnStoneQuarry_sledStones = new EventEmitter<number>();
  @Output() onEvent_setClickHandlerOnStoneQuarry_quarryStones = new EventEmitter<number>();
  @Output() onEvent_setClickHandlerOnBlueMarketCards_bll_3_marketCards = new EventEmitter<number[]>();
  @Output() onEvent_setClickHandlerOnBlueMarketCards_bml_3_marketCards = new EventEmitter<number[]>();
  @Output() onEvent_setClickHandlerOnBlueMarketCards_bmr_3_marketCards = new EventEmitter<number[]>();
  @Output() onEvent_setClickHandlerOnBlueMarketCards_brr_3_marketCards = new EventEmitter<number[]>();


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
    this.playerFieldStone = new Stone(0, ColourEnum.brown)

  }

  checkStonesDragable(){
    this.hasStones=this.sledStones>0;
  }

  //================
  // ngAfterViewInit
  //================

  ngAfterViewInit() {

    //this.show_hide_stone_at_init();

  }

  //===============
  // Other-Methods
  //===============

  //===========================================================
  // Click Events
  //===========================================================

  setClickHandlerOnStoneQuarry() {

    //set click handler for  bll_1
    (<any>$(document)).ready(() =>{
      (<any>$("#quarry_3")).on("click", () =>{
        // alert("The stone quarry 3 was clicked.");
        this.onEvent_setClickHandlerOnStoneQuarry_sledStones.emit(this.sledStones);
        this.onEvent_setClickHandlerOnStoneQuarry_quarryStones.emit(this.quarryStones);
      });
    });

  }

  removeClickHandlerOnStoneQuarry() {

    //set click handler for  bll_3
    (<any>$(document)).ready(() =>{
      (<any>$("#quarry_3")).off("click");
    });

  }

  setClickHandlerOnBlueMarketCards() {

    //set click handler for  bll_3
    (<any>$(document)).ready(() =>{
      (<any>$("#bll_3_")).on("click", () =>{
        alert("The chisel was clicked.");
        this.onEvent_setClickHandlerOnBlueMarketCards_bll_3_marketCards.emit(this.marketCards);
      });
    });

    //set click handler for  bml_3
    (<any>$(document)).ready(() =>{
      (<any>$("#bml_3_")).on("click", () =>{
        alert("The hammer was clicked.");
        this.onEvent_setClickHandlerOnBlueMarketCards_bml_3_marketCards.emit(this.marketCards);
      })
    });

    //set click handler for  bmr_3
    (<any>$(document)).ready(() =>{
      (<any>$("#bmr_3_")).on("click", () =>{
        alert("The sail was clicked.");
        this.onEvent_setClickHandlerOnBlueMarketCards_bmr_3_marketCards.emit(this.marketCards);
      })
    });

    //set click handler for  brr_3
    (<any>$(document)).ready(() =>{
      (<any>$("#brr_3_")).on("click", () =>{
        alert("The lever was clicked.");
        this.onEvent_setClickHandlerOnBlueMarketCards_brr_3_marketCards.emit(this.marketCards);
      })
    });
  }

  removeClickHandlerOnBlueMarketCards(){

    //remove click handler for  bll_3
    (<any>$(document)).ready(function () {
      (<any>$("#bll_3_")).off("click");
    });

    //remove click handler for  bml_3
    (<any>$(document)).ready(function () {
      (<any>$("#bml_3_")).off("click");
    });

    //remove click handler for  bmr_3
    (<any>$(document)).ready(function () {
      (<any>$("#bmr_3_")).off("click");
    });

    //remove click handler for  brr_3
    (<any>$(document)).ready(function () {
      (<any>$("#brr_3_")).off("click");
    });

  }


  //===========================================================
  // Change Text / Numbers
  //===========================================================


  setPlayerName(playerName_target:string){

    //update attribute: score
    this.playerName=playerName_target;

  }

  setPlayerDataWithArray_increaseByNumber(ArrayOf0To11:number[]){

    // [Score, Sled, Quarry, Statue, PyrDec, TemDec, BurDec, ObeDec, Chisel, Hammer, Sail, Lever]
    //    0      1      2      3        4       5       6      7        8      9      10     11

    //update attribute: score
    this.score+=ArrayOf0To11[0];

    //update attribute: sledStones
    this.sledStones+=ArrayOf0To11[1];

    // update attribute: quarryStones
    this.quarryStones+=ArrayOf0To11[2];

    // purple[0],tll..trr,[1-4] bll..brr,[5-8]
    for(let i = 0; i < ArrayOf0To11.length; i++){
      this.marketCards[i] += ArrayOf0To11[i+3];
    }

  }

  setMarketCards(marketCards_target:number[]){

    // define protocol: which market card
    // corresponds to which array index
    //tll..trr, bll..brr, purple

    for(let i = 0; i < marketCards_target.length; i++){
      if(marketCards_target[i] != null)
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

  update_takeStonesFromQuarry(howMany: number){              //this function is used for telling that the player has taken stones from the quarry
    this.quarryStones -= howMany;
    this.sledStones += howMany;
  }

  hideStone(){
    (<any>$(document)).ready(function (){
      (<any>$("#bag_3")).hide();
    });

  }

  showStone(){
    (<any>$(document)).ready(function (){
      (<any>$("#bag_3")).show();
    });
  }


  //===========================================================
  // PlayerField and Icon Colouring / Opacity change
  //===========================================================


  playerFieldGlow(status: boolean) {
    (<any>$(document)).ready(() => {
      if(status)
        (<any>$("#glow")).css("background-image", "url(../../assets/images/top_right_active.png)");
      else
        (<any>$("#glow")).css("background-image", "url(../../assets/images/top_right.png)");
    });
  }

  //deactivates at the moment the icon top-left-left,
  // this function cannot reactivate icon

  deactivateOrActivateIcons_onChange(playerIconsStatus_target:string[]){


    //deactivates market card icons at the top of player top-right
    //--------------------------------------------------------------

    if (playerIconsStatus_target[1] == "false") {
      (<any>$(document)).ready(function (){
        (<any>$("#tll_3")).css("opacity", "0.3");

      });

      if(0){console.log("deactivateOrActivateIcons: false")}
    }
    if (playerIconsStatus_target[1] == "true"){
      (<any>$(document)).ready(function (){
        (<any>$("#tll_3")).css("opacity", "1.0");

      });
      if(0){console.log("deactivateOrActivateIcons: true")}
    }

    if (playerIconsStatus_target[2] == "false") {
      (<any>$(document)).ready(function (){
        (<any>$("#tml_3")).css("opacity", "0.3");

      });

      if(0){console.log("deactivateOrActivateIcons: false")}
    }
    if (playerIconsStatus_target[2] == "true"){
      (<any>$(document)).ready(function (){
        (<any>$("#tml_3")).css("opacity", "1.0");

      });
      if(0){console.log("deactivateOrActivateIcons: true")}
    }

    if (playerIconsStatus_target[3] == "false") {
      (<any>$(document)).ready(function (){
        (<any>$("#tmr_3")).css("opacity", "0.3");

      });

      if(0){console.log("deactivateOrActivateIcons: false")}
    }
    if (playerIconsStatus_target[3] == "true"){
      (<any>$(document)).ready(function (){
        (<any>$("#tmr_3")).css("opacity", "1.0");

      });
      if(0){console.log("deactivateOrActivateIcons: true")}
    }

    if (playerIconsStatus_target[4] == "false") {
      (<any>$(document)).ready(function (){
        (<any>$("#trr_3")).css("opacity", "0.3");

      });

      if(0){console.log("deactivateOrActivateIcons: false")}
    }
    if (playerIconsStatus_target[4] == "true"){
      (<any>$(document)).ready(function (){
        (<any>$("#trr_3")).css("opacity", "1.0");

      });
      if(0){
        console.log("deactivateOrActivateIcons: true")
      }
    }


    //deactivates market card icons at the bottom of player top-right
    //-----------------------------------------------------------------

    if (playerIconsStatus_target[5] == "false") {
      (<any>$(document)).ready(function (){
        (<any>$("#bll_3")).css("opacity", "0.3");

      });

      if(0){console.log("deactivateOrActivateIcons: false")}
    }
    if (playerIconsStatus_target[5] == "true"){
      (<any>$(document)).ready(function (){
        (<any>$("#bll_3")).css("opacity", "1.0");

      });
      if(0){console.log("deactivateOrActivateIcons: true")}
    }

    if (playerIconsStatus_target[6] == "false") {
      (<any>$(document)).ready(function (){
        (<any>$("#bml_3")).css("opacity", "0.3");

      });

      if(0){console.log("deactivateOrActivateIcons: false")}
    }
    if (playerIconsStatus_target[6] == "true"){
      (<any>$(document)).ready(function (){
        (<any>$("#bml_3")).css("opacity", "1.0");

      });
      if(0){
        console.log("deactivateOrActivateIcons: true")
      }
    }

    if (playerIconsStatus_target[7] == "false") {
      (<any>$(document)).ready(function (){
        (<any>$("#bmr_3")).css("opacity", "0.3");

      });

      if(0){
        console.log("deactivateOrActivateIcons: false")
      }
    }
    if (playerIconsStatus_target[7] == "true"){
      (<any>$(document)).ready(function (){
        (<any>$("#bmr_3")).css("opacity", "1.0");

      });
      if(0){
        console.log("deactivateOrActivateIcons: true")
      }
    }

    if (playerIconsStatus_target[8] == "false") {
      (<any>$(document)).ready(function (){
        (<any>$("#brr_3")).css("opacity", "0.3");

      });

      if(0){
        console.log("deactivateOrActivateIcons: false")
      }
    }
    if (playerIconsStatus_target[8] == "true"){
      (<any>$(document)).ready(function (){
        (<any>$("#brr_3")).css("opacity", "1.0");

      });
      if(0){
        console.log("deactivateOrActivateIcons: true")
      }
    }


    //deactivates purple market card icon of player top-right
    //---------------------------------------------------------

    if (playerIconsStatus_target[0] == "false") {
      (<any>$(document)).ready(function (){
        (<any>$("#purple_3")).css("opacity", "0.3");

      });

      if(0){
        console.log("deactivateOrActivateIcons: false")
      }
    }
    if (playerIconsStatus_target[0] == "true"){
      (<any>$(document)).ready(function (){
        (<any>$("#purple_3")).css("opacity", "1.0");

      });
      if(0){
        console.log("deactivateOrActivateIcons: true")
      }
    }

  }


  deactivateOrActivateIcons(playerIconsStatus_target:boolean[]){


    //deactivates market card icons at the top of player top-right
    //--------------------------------------------------------------

    if (playerIconsStatus_target[1] == false) {
      (<any>$(document)).ready(function (){
        (<any>$("#tll_3")).css("opacity", "0.3");

      });

      if(0){
        console.log("deactivateOrActivateIcons: false")
      }
    }
    if (playerIconsStatus_target[1] == true){
      (<any>$(document)).ready(function (){
        (<any>$("#tll_3")).css("opacity", "1.0");

      });
      if(0){
        console.log("deactivateOrActivateIcons: true")
      }
    }

    if (playerIconsStatus_target[2] == false) {
      (<any>$(document)).ready(function (){
        (<any>$("#tml_3")).css("opacity", "0.3");

      });

      if(0){
        console.log("deactivateOrActivateIcons: false")
      }
    }
    if (playerIconsStatus_target[2] == true){
      (<any>$(document)).ready(function (){
        (<any>$("#tml_3")).css("opacity", "1.0");

      });
      if(0){
        console.log("deactivateOrActivateIcons: true")
      }
    }

    if (playerIconsStatus_target[3] == false) {
      (<any>$(document)).ready(function (){
        (<any>$("#tmr_3")).css("opacity", "0.3");

      });

      if(0){
        console.log("deactivateOrActivateIcons: false")
      }
    }
    if (playerIconsStatus_target[3] == true){
      (<any>$(document)).ready(function (){
        (<any>$("#tmr_3")).css("opacity", "1.0");

      });
      if(0){
        console.log("deactivateOrActivateIcons: true")
      }
    }

    if (playerIconsStatus_target[4] == false) {
      (<any>$(document)).ready(function (){
        (<any>$("#trr_3")).css("opacity", "0.3");

      });

      if(0){
        console.log("deactivateOrActivateIcons: false")
      }
    }
    if (playerIconsStatus_target[4] == true){
      (<any>$(document)).ready(function (){
        (<any>$("#trr_3")).css("opacity", "1.0");

      });
      if(0){
        console.log("deactivateOrActivateIcons: true")
      }
    }


    //deactivates market card icons at the bottom of player top-right
    //-----------------------------------------------------------------

    if (playerIconsStatus_target[5] == false) {
      (<any>$(document)).ready(function (){
        (<any>$("#bll_3")).css("opacity", "0.3");

      });

      if(0){
        console.log("deactivateOrActivateIcons: false")
      }
    }
    if (playerIconsStatus_target[5] == true){
      (<any>$(document)).ready(function (){
        (<any>$("#bll_3")).css("opacity", "1.0");

      });
      if(0){
        console.log("deactivateOrActivateIcons: true")
      }
    }

    if (playerIconsStatus_target[6] == false) {
      (<any>$(document)).ready(function (){
        (<any>$("#bml_3")).css("opacity", "0.3");

      });

      if(0){
        console.log("deactivateOrActivateIcons: false")
      }
    }
    if (playerIconsStatus_target[6] == true){
      (<any>$(document)).ready(function (){
        (<any>$("#bml_3")).css("opacity", "1.0");

      });
      if(0){
        console.log("deactivateOrActivateIcons: true")
      }
    }

    if (playerIconsStatus_target[7] == false) {
      (<any>$(document)).ready(function (){
        (<any>$("#bmr_3")).css("opacity", "0.3");

      });

      if(0){
        console.log("deactivateOrActivateIcons: false")
      }
    }
    if (playerIconsStatus_target[7] == true){
      (<any>$(document)).ready(function (){
        (<any>$("#bmr_3")).css("opacity", "1.0");

      });
      if(0){
        console.log("deactivateOrActivateIcons: true")
      }
    }

    if (playerIconsStatus_target[8] == false) {
      (<any>$(document)).ready(function (){
        (<any>$("#brr_3")).css("opacity", "0.3");

      });

      if(0){
        console.log("deactivateOrActivateIcons: false")
      }
    }
    if (playerIconsStatus_target[8] == true){
      (<any>$(document)).ready(function (){
        (<any>$("#brr_3")).css("opacity", "1.0");

      });
      if(0){
        console.log("deactivateOrActivateIcons: true")
      }
    }


    //deactivates purple market card icon of player top-right
    //---------------------------------------------------------

    if (playerIconsStatus_target[0] == false) {
      (<any>$(document)).ready(function (){
        (<any>$("#purple_3")).css("opacity", "0.3");

      });

      if(0){
        console.log("deactivateOrActivateIcons: false")
      }
    }
    if (playerIconsStatus_target[0] == true){
      (<any>$(document)).ready(function (){
        (<any>$("#purple_3")).css("opacity", "1.0");

      });
      if(0){
        console.log("deactivateOrActivateIcons: true")
      }
    }

  }


  deactivateOrActivateScore(playerStoneQuarryStatus_target){

    if (playerStoneQuarryStatus_target == false) {
      (<any>$(document)).ready(function (){
        (<any>$("#score_3")).css("opacity", "0.3");

      });

      if(0){console.log("deactivateOrActivateScore: false")}
    }
    if (playerStoneQuarryStatus_target == true){
      (<any>$(document)).ready(function (){
        (<any>$("#score_3")).css("opacity", "1.0");

      });
      if(0){console.log("deactivateOrActivateScore: true")}
    }

  }

  deactivateOrActivateStoneQuarry(playerStoneQuarryStatus_target){

    if (playerStoneQuarryStatus_target == false) {
      (<any>$(document)).ready(function (){
        (<any>$("#quarry_3")).css("opacity", "0.3");

      });

      if(0){console.log("deactivateOrActivateStoneQuarry: false")}
    }
    if (playerStoneQuarryStatus_target == true){
      (<any>$(document)).ready(function (){
        (<any>$("#quarry_3")).css("opacity", "1.0");

      });
      if(0){console.log("deactivateOrActivateStoneQuarry: true")}
    }

  }

  deactivateOrActivateSupplySled(playerSupplySledStatus_target){

    if (playerSupplySledStatus_target == false) {
      (<any>$(document)).ready(function (){
        (<any>$("#supply_sled_3")).css("opacity", "0.3");

      });

      if(0){console.log("deactivateOrActivateSupplySled: false")}
    }
    if (playerSupplySledStatus_target == true){
      (<any>$(document)).ready(function (){
        (<any>$("#supply_sled_3")).css("opacity", "1.0");

      });
      if(0){console.log("deactivateOrActivateSupplySled: true")}
    }

  }

  deactivateOrActivatePlayerField(playerPlayerFieldStatus_target){

    if (playerPlayerFieldStatus_target == false) {
      (<any>$(document)).ready(function (){
        (<any>$("#playerField_3")).css("opacity", "0.3");

      });

      if(0){console.log("playerPlayerFieldStatus: false")}
    }
    if (playerPlayerFieldStatus_target == true){
      (<any>$(document)).ready(function (){
        (<any>$("#playerField_3")).css("opacity", "1.0");

      });
      if(0){console.log("playerPlayerFieldStatus: true")}
    }


  }


  //================
  // Popover-Methods
  //================

  initializePopovers(){

    //From bottom-left-left
    (<any>$('#bll_3')).popover({
      placement: 'bottom',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 500, hide: 500}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px" class="non-draggable" src="../../../../assets/images/cards/chisel.png"/>'
    });


    //From bottom-middle-left
    (<any>$('#bml_3')).popover({
      placement: 'bottom',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 500, hide: 500}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px" class="non-draggable" src="../../../../assets/images/cards/hammer.png"/>'
    });


    //From bottom-middle-right
    (<any>$('#bmr_3')).popover({
      placement: 'bottom',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 500, hide: 500}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px" class="non-draggable" src="../../../../assets/images/cards/sail.png"/>'
    });

    //From bottom-right-right
    (<any>$('#brr_3')).popover({
      placement: 'bottom',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 500, hide: 500}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px" class="non-draggable" src="../../../../assets/images/cards/lever.png"/>'
    });

    //From purple-card
    (<any>$('#purple_3')).popover({
      placement: 'bottom',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 500, hide: 500}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px" class="non-draggable" src="../../../../assets/images/cards/statue.png"/>'
    });

    //From top-left-left
    (<any>$('#tll_3')).popover({
      placement: 'bottom',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 500, hide: 500}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px" class="non-draggable" src="../../../../assets/images/cards/pyramiddec.png"/>'
    });

    //From top-middle-left
    (<any>$('#tml_3')).popover({
      placement: 'bottom',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 500, hide: 500}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px" class="non-draggable" src="../../../../assets/images/cards/templedec.png"/>'
    });

    //From top-middle-right
    (<any>$('#tmr_3')).popover({
      placement: 'bottom',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 500, hide: 500}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px" class="non-draggable" src="../../../../assets/images/cards/burialdec.png"/>'
    });

    //From top-right-right
    (<any>$('#trr_3')).popover({
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
