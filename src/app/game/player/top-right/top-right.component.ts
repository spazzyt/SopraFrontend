import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import {Stone} from "../../../shared/models/stone";
import {ColourEnum} from "../../../shared/models/colour.enum";
import {SupplySled} from "../../../shared/models/supply-sled";
import {StoneQuarry} from "../../../shared/models/stone-quarry";
import {MarketCard} from "../../../shared/models/market-card";
import {Game} from "../../../shared/models/game";
import {Ship} from "../../../shared/models/ship";
import {GameService} from "../../../shared/services/game.service";
import {Move} from "../../../shared/models/move";
import {PositionEnum} from "../../../shared/models/position.enum";

@Component({
  selector: 'app-top-right',
  templateUrl: './top-right.component.html',
  styleUrls: ['./top-right.component.css']
})

//===========
// Component
//===========
export class TopRightComponent implements OnInit {

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
  public cardNumbers:number[] = [0,0,0,0,0,0,0,0,0];

  // does the player have stones in his sleds
  public hasStones:boolean;

  //is this my field?
  public isThisMyField: boolean = false;

  //==============
  // Event Emitter
  //==============

  @Output() onEvent_setClickHandlerOnStoneQuarry_sledStones = new EventEmitter<number>();
  @Output() onEvent_setClickHandlerOnStoneQuarry_quarryStones = new EventEmitter<number>();

  //===============
  //Constructor
  //===============
  constructor(private gameService: GameService) {

  }

  ngOnInit() {

    // stone generated in supply sled
    this.playerFieldStone = new Stone(0, ColourEnum.brown)
  }

  checkStonesDragable(){
    if(this.myColour == ColourEnum.brown){
      this.isThisMyField = true;
    }
    else this.isThisMyField = false;

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

  //===========================================================
  // PlayerField and Icon Colouring / Opacity change
  //===========================================================


  playerFieldGlow(status: boolean) {
    (<any>$(document)).ready(() => {
      if(status)
        (<any>$("#glow3")).css("background-image", "url(../../assets/images/top_right_active.png)");
      else
        (<any>$("#glow3")).css("background-image", "url(../../assets/images/top_right.png)");
    });
  }

  //=============================
  // Market Card Functionalities
  //=============================

  playCard(index: number){  //TODO add this to other players
    console.log("PLAYER TRIES TO PLAY CARD " + index)

    //TODO when copypasting, adapt "black" to other players colour!!
    //if player has this card and it's his turn
    if(this.myColour == ColourEnum.brown && this.canIPlay && this.cardNumbers[index] > 0){

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
          //TODO send move to backend - determine format??
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

  //=============================
  // Quarry Functionality
  //=============================

  takeStonesFromQuarryToSled(){

    if(this.myColour == ColourEnum.brown && this.canIPlay && this.quarryStones > 0){

      //make calculations (how many stones, needed to send correct move to backend)
      let stonesInQuarry:number;
      let stonesInSled:number;
      let stonesToTake:number;

      stonesInQuarry=this.quarryStones;
      stonesInSled=this.sledStones;

      if(stonesInSled < 5){
        if(stonesInSled < 3){
          stonesToTake = Math.min(stonesInQuarry, 3);
        }
        else{
          stonesToTake = Math.min(stonesInQuarry, 5-stonesInSled);
        }
      }
      else{
        //this.showSnackbarMessage("You can't take any stones because your sled is full.")
        return;
      }

      //generate move object
      let moveToSend = new Move(PositionEnum.Quarry, PositionEnum.Sled, stonesToTake);
      //Send move to backend
      this.gameService.sendMove(moveToSend);

      //snackbar message (only locally)
      //this.showSnackbarMessage("You took "+ stonesToTake+" stone(s) from the quarry.");
    }
  }
}
