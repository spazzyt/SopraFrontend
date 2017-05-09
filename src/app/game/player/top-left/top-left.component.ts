import { Component, OnInit, EventEmitter, Output, Input} from '@angular/core';
import {Stone} from "../../../shared/models/stone";
import {ColourEnum} from "../../../shared/models/colour.enum";
import {StoneQuarry} from "../../../shared/models/stone-quarry";
import {SupplySled} from "../../../shared/models/supply-sled";
import {MarketCard} from "../../../shared/models/market-card";
import {Game} from "../../../shared/models/game";
import {Ship} from "../../../shared/models/ship";
import {GameService} from "../../../shared/services/game.service";
import {Move} from "../../../shared/models/move";
import {PositionEnum} from "../../../shared/models/position.enum";

@Component({
  selector: 'app-top-left',
  templateUrl: './top-left.component.html',
  styleUrls: ['./top-left.component.css']
})

//===========
// Component
//===========
export class TopLeftComponent implements OnInit {

  @Input()
  ships: Ship[];
  @Input()
  marketCards: MarketCard[];
  @Input()
  canIPlay: boolean;
  @Input()
  myColour: ColourEnum;

  @Input()
  gameComp: any;

  @Input()
  sailPlayed: boolean;

  @Input()
  sailMove: Move;


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


  //===============
  //Constructor
  //===============
  constructor(private gameService: GameService) {

  }

  ngOnInit() {

    //Popovers must be initialized in ngOnInit()
    //this.initializePopovers();

    // stone generated in supply sled
    this.playerFieldStone = new Stone(0, ColourEnum.white);
  }

  checkStonesDragable(){
    if(this.myColour == ColourEnum.white){
      this.isThisMyField = true;
    }
    else this.isThisMyField = false;

    this.hasStones=this.sledStones>0;
  }

  updateCardNumbers(){
    this.cardNumbers = this.cardArrayToNumberArray(this.marketCards);
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
        (<any>$("#glow2")).css("background-image", "url(../../assets/images/top_left_active.png)");
      else
        (<any>$("#glow2")).css("background-image", "url(../../assets/images/top_left.png)");
    });
  }

  //=============================
  // Market Card Functionalities
  //=============================

  playCard(index: number){
    console.log("PLAYER TRIES TO PLAY CARD " + index)

    //TODO when copypasting, adapt "black" to other players colour!!
    //if player has this card and it's his turn
    if(this.myColour == ColourEnum.white && this.canIPlay && this.cardNumbers[index] > 0){

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
        if(this.sledStones >= 2)
          this.gameComp.showSnackbarMessage("There aren't two free stone slots.");
        else
          this.gameComp.showSnackbarMessage("You don't have enough stones.");
        return;
      }

      if(index == 6 && (this.quarryStones < 3 || freeSlots < 1 || this.sledStones > 2)){
        if(this.quarryStones < 3)
          this.gameComp.showSnackbarMessage("You don't have 3 stones in your quarry.");
        else    //TODO tell player more clearly why he can't play card (for all cases)
          this.gameComp.showSnackbarMessage("You can't play the hammer card at the moment.");

        return;
      }
      if(index == 7 && (freeSlots < 1 || !shipsSailableWithOneStone)){
        console.log("CARD INDEX IS ", index);
        this.gameComp.showSnackbarMessage("You can't play the sail card at the moment.");
        return;
      }
      if(index == 8 && !shipsSailable){
        this.gameComp.showSnackbarMessage("Can't play lever card, no ship is sailable.");
        return;
      }

      //END OF MAD SORCERY

      console.log('PLAYER CAN PLAY CARD ' + index + ', SENDING TO BACKEND');

      switch(index){
        case 5: //Chisel
          console.log("PLAYING CHISEL! STATUS: " + this.gameComp.game.chiselPlayed);
          this.gameComp.game.chiselPlayed = true;
          console.log("THE CHISEL HAS BEEN PLAYED! STATUS: " + this.gameComp.game.chiselPlayed);
          let chiselId= -1;

          for(let card of this.marketCards){

            //search for hammer card in player's card array
            if(card.id == 24 || card.id == 25 || card.id == 26){
              chiselId = card.id;
              break;
            }
          }
          this.gameComp.game.chiselId = chiselId;
          console.log("PLAYED CHISEL CARD WITH ID " + chiselId);
          break;

        case 6: //Hammer

          //lets the game know the hammer has been played
          console.log("PLAYING HAMMER! STATUS: " + this.gameComp.game.hammerPlayed);
          this.gameComp.game.hammerPlayed = true;
          console.log("THE HAMMER HAS BEEN PLAYED! STATUS: " + this.gameComp.game.hammerPlayed);

          let hammerId= -1;

          for(let card of this.marketCards){

            //search for hammer card in player's card array
            if(card.id == 29 || card.id == 30){
              hammerId = card.id;
              break;
            }
          }
          this.gameComp.game.hammerId = hammerId;

          console.log("PLAYED HAMMER CARD WITH ID " + hammerId);

          this.quarryStones -= 3;
          this.sledStones += 3;
          this.hasStones = true;
          break;

        case 7: //Sail
          console.log("PLAYING SAIL! STATUS: " + this.gameComp.game.sailPlayed);
          this.gameComp.game.sailPlayed = true;
          console.log("THE SAIL HAS BEEN PLAYED! STATUS: " + this.gameComp.game.sailPlayed);
          let sailId= -1;

          for(let card of this.marketCards){

            //search for sail card in player's card array
            if(card.id == 31 || card.id == 32 || card.id == 33){
              sailId = card.id;
              break;
            }
          }
          this.gameComp.game.sailId = sailId;
          console.log("PLAYED SAIL CARD WITH ID " + sailId);
          break;

        case 8: //Lever
          //lets the game know the lever has been played
          console.log("PLAYING LEVER! STATUS: " + this.gameComp.game.leverPlayed);
          this.gameComp.game.leverPlayed = true;
          console.log("THE LEVER HAS BEEN PLAYED! STATUS: " + this.gameComp.game.leverPlayed);


          let cardId= -1;

          for(let card of this.marketCards){

            //search for lever card in card array
            if(card.id == 27 || card.id == 28){
              cardId = card.id;
              break;
            }
          }


          this.gameComp.infoBoxComponent.leverId = cardId;
          console.log("PLAYED LEVER CARD WITH ID " + cardId);

          this.gameComp.pyramidComponent.finalDestinationComponent.leverPlayed = this.gameComp.game.leverPlayed;
          this.gameComp.templeComponent.finalDestinationComponent.leverPlayed = this.gameComp.game.leverPlayed;
          this.gameComp.burialChamberComponent.finalDestinationComponent.leverPlayed = this.gameComp.game.leverPlayed;
          this.gameComp.obeliskComponent.finalDestinationComponent.leverPlayed = this.gameComp.game.leverPlayed;
          this.gameComp.marketComponent.finalDestinationComponent.leverPlayed = this.gameComp.game.leverPlayed;

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
    console.log("PLAYER TRIES TO TAKE FROM QUARRY, HAMMER STATUS: ", this.gameComp.game.hammerPlayed);
    if(this.gameComp.game.sailPlayed == false && this.gameComp.game.chiselPlayed == false && this.gameComp.game.hammerPlayed == false && this.myColour == ColourEnum.white && this.canIPlay && this.quarryStones > 0){

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
