import {Component, OnInit, EventEmitter, Output, Input} from '@angular/core';
import {Stone} from "../../../shared/models/stone";
import {ColourEnum} from "../../../shared/models/colour.enum";
import {StoneQuarry} from "../../../shared/models/stone-quarry";
import {SupplySled} from "../../../shared/models/supply-sled";
import {MarketCard} from "../../../shared/models/market-card";
import {Game} from "../../../shared/models/game";
import {Ship} from "../../../shared/models/ship";

@Component({
  selector: 'app-bottom-left',
  templateUrl: './bottom-left.component.html',
  styleUrls: ['./bottom-left.component.css']
})

//===========
// Component
//===========
export class BottomLeftComponent implements OnInit {

  @Input()
  ships: Ship[];
  @Input()
  marketCards: MarketCard[];
  @Input()
  canIPlay: boolean;
  @Input()
  myColour: ColourEnum;

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
  public cardNumbers:number[] = [0,0,0,0,0,0,0,0,0];

  // does the player have stones in his sleds
  public hasStones:boolean;


  //==============
  // Event Emitter
  //==============

  @Output() onEvent_setClickHandlerOnStoneQuarry_sledStones = new EventEmitter<number>();
  @Output() onEvent_setClickHandlerOnStoneQuarry_quarryStones = new EventEmitter<number>();

  //===============
  //Constructor
  //===============
  constructor() {

  }

  ngOnInit() {

    //Popovers must be initialized in ngOnInit()
    this.initializePopovers();

    // stone generated in supply sled
    this.playerFieldStone = new Stone(0, ColourEnum.black);
  }

  checkStonesDragable(){
    this.hasStones=this.sledStones>0;
  }

  updateCardNumbers(){
    this.cardNumbers = this.cardArrayToNumberArray(this.marketCards);
  }

  //===========================================================
  // Click Events
  //===========================================================

  setClickHandlerOnStoneQuarry() {

    //set click handler for  bll_1
    (<any>$(document)).ready(() =>{
      (<any>$("#quarry_1")).on("click", () =>{
        //alert("The stone quarry 1 was clicked.");
        this.onEvent_setClickHandlerOnStoneQuarry_sledStones.emit(this.sledStones);
        this.onEvent_setClickHandlerOnStoneQuarry_quarryStones.emit(this.quarryStones);
      });
    });

  }

  removeClickHandlerOnStoneQuarry() {

    //set click handler for  bll_1
    (<any>$(document)).ready(() =>{
      (<any>$("#quarry_1")).off("click");
    });

  }

  //===========================================================
  // Change Text / Numbers
  //===========================================================

  setPlayerName(playerName_target:string){

    //update attribute: score
    this.playerName=playerName_target;
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
      (<any>$("#bag_1")).hide();
    });

  }

  showStone(){
    (<any>$(document)).ready(function (){
      (<any>$("#bag_1")).show();
    });
  }

  //===========================================================
  // PlayerField and Icon Colouring / Opacity change
  //===========================================================

  playerFieldGlow(status: boolean) {
    (<any>$(document)).ready(() => {
      if(status)
        (<any>$("#glow1")).css("background-image", "url(../../assets/images/bottom_left_active.png)");
      else
        (<any>$("#glow1")).css("background-image", "url(../../assets/images/bottom_left.png)");
    });
  }

  //=============================
  // Market Card Functionalities
  //=============================

  playCard(index: number){  //TODO add this to other players
    console.log("PLAYER TRIES TO PLAY CARD " + index)

    //TODO when copypasting, adapt "black" to other players colour!!
    //if player has this card and it's his turn
    if(this.myColour == ColourEnum.black && this.canIPlay && this.cardNumbers[index] > 0){

      console.log("SHIPPERINOS: ", this.ships);
      //determine amount of free slots on all ships (to check if you can place two stones on ships)
      let freeSlots = 0;
      for(let ship of this.ships){
        if(ship.isInHarbour){
          for(let i = 0; i < ship.slots.length; i++){
            if(ship.slots[i] == null){
              freeSlots++;
            }
          }
        }
      }



      //WARNING, MAD SORCERY AHEAD, DO NOT EDIT
      //check if any ships are sailable;

      let shipsSailable = false;
      for(let ship of this.ships){
        if(ship.isInHarbour && ship.draggable) shipsSailable = true; //if any ship is sailable, set to true
      }
      let shipsSailableWithOneStone = false;

      for(let ship of this.ships){
        if(ship.isInHarbour && !ship.draggable) {

          let freeSlotsOnShip = 0;      //how many stones are on the ship?

          for(let slot of ship.slots){
            if(slot == null){
              freeSlotsOnShip++;
            }
          }
          if(freeSlotsOnShip >= 1 && freeSlotsOnShip <= 2){
            shipsSailableWithOneStone = true; //if any ship is sailable, set to true
          }
        }
      }

      //Checks for each possible card if it's not playable (if not playable, return)
      if(index == 5 && this.sledStones < 2 && freeSlots >= 2){
        return;
      }

      if(index == 6 && (this.quarryStones < 3 || freeSlots < 1)){
        return;
      }
      if(index == 7 && freeSlots < 1 && !shipsSailableWithOneStone){
        return;
      }
      if(index == 8 && !shipsSailable){
        return;
      }

      //END OF MAD SORCERY

      console.log('PLAYER CAN PLAY CARD ' + index + ', SENDING TO BACKEND');

      switch(index){
        case 5: //Chisel
          //TODO send move to backend
          break;

        case 6: //Hammer
          //TODO send move to backend
          break;

        case 7: //Sail
          //TODO send move to backend
          break;

        case 8: //Lever
          //TODO wait until player sails a ship to a site
          //TODO then show modal for choosing stone order (WITH the corresponding ship)
          break;
      }

    }
  }


  cardArrayToNumberArray(cards: MarketCard[]){

    // PlayerFieldsIcons
    // [Statue, PyrDec, TemDec, BurDec, ObeDec, Chisel, Hammer, Sail, Lever]
    //      0      1      2        3      4       5       6      7      8

    let returnArray = [0,0,0,0,0,0,0,0,0];
    if(!cards)
      return returnArray;

    for(let card of cards){
      if(card.id >= 0 && card.id <= 9){ //Statue
        returnArray[0] += 1;
      }
      else if(card.id >= 10 && card.id <= 11){
        returnArray[1] += 1;
      }
      else if(card.id >= 12 && card.id <= 13){
        returnArray[4] += 1;
      }
      else if(card.id >= 14 && card.id <= 15){
        returnArray[3] += 1;
      }
      else if(card.id >= 16 && card.id <= 17){
        returnArray[2] += 1;
      }
      else if(card.id >= 24 && card.id <= 26){
        returnArray[5] += 1;
      }
      else if(card.id >= 27 && card.id <= 28){
        returnArray[8] += 1;
      }
      else if(card.id >= 29 && card.id <= 30){
        returnArray[6] += 1;
      }
      else if(card.id >= 31 && card.id <= 33){
        returnArray[7] += 1;
      }
    }

    return returnArray;
  }

  //===========================================================
  // Popover Methods
  //===========================================================

  initializePopovers(){

    //From bottom-left-left
    (<any>$('#bll_1')).popover({
      placement: 'top',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 500, hide: 500}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px"  class="non-draggable" src="../../../../assets/images/cards/chisel.png"/>'
    });


    //From bottom-middle-left
    (<any>$('#bml_1')).popover({
      placement: 'top',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 500, hide: 500}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px" class="non-draggable" src="../../../../assets/images/cards/hammer.png"/>'
    });


    //From bottom-middle-right
    (<any>$('#bmr_1')).popover({
      placement: 'top',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 500, hide: 500}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px" class="non-draggable" src="../../../../assets/images/cards/sail.png"/>'
    });

    //From bottom-right-right
    (<any>$('#brr_1')).popover({
      placement: 'top',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 500, hide: 500}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px" class="non-draggable" src="../../../../assets/images/cards/lever.png"/>'
    });

    //From purple-card
    (<any>$('#purple_1')).popover({
      placement: 'top',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 500, hide: 500}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px" class="non-draggable" src="../../../../assets/images/cards/statue.png"/>'
    });

    //From top-left-left
    (<any>$('#tll_1')).popover({
      placement: 'top',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 500, hide: 500}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px" class="non-draggable" src="../../../../assets/images/cards/pyramiddec.png"/>'
    });

    //From top-middle-left
    (<any>$('#tml_1')).popover({
      placement: 'top',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 500, hide: 500}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px" class="non-draggable" src="../../../../assets/images/cards/templedec.png"/>'
    });

    //From top-middle-right
    (<any>$('#tmr_1')).popover({
      placement: 'top',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 500, hide: 500}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px" class="non-draggable" src="../../../../assets/images/cards/burialdec.png"/>'
    });

    //From top-right-right
    (<any>$('#trr_1')).popover({
      placement: 'top',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 500, hide: 500}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px" class="non-draggable" src="../../../../assets/images/cards/obeliskdec.png"/>'
    });

  }
}
