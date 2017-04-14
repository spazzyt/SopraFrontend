import { Component, OnInit } from '@angular/core';
import {Ship} from "../../shared/models/ship";
import {RoundCard} from "../../shared/models/round-card";
import {Stone} from "../../shared/models/stone";
import {ColourEnum} from "../../shared/models/colour.enum";


@Component({
  selector: 'app-departing-harbour',
  templateUrl: './departing-harbour.component.html',
  styleUrls: ['./departing-harbour.component.css']
})

export class DepartingHarbourComponent {

  //===============
  //Class Variables
  //===============
  ships: Ship[] = [];
  changeStyleFlag: boolean=false;  //jQuery

  //===============
  //Constructor
  //===============
  constructor() {

  }

  //===============
  //ngOnInit
  //===============

  ngOnInit() {

  }

  //===============
  //Class Methods
  //===============


  // Generate Ship
  generateShip(ship:Ship){

  }


  // Remove Ship
  removeShip(ship:Ship){

  }



  // Generate Ships
  generateFourShips(ships_target: Ship[]){

    //fill ships array
    this.ships = ships_target;

  }

  // Remove Ships
  removeShips(){
    this.ships = [];
  }

  //change Style
  toggleStyle(){
    this.changeStyleFlag =! this.changeStyleFlag;
  }

  changeBGColourStyle() {
    if(this.changeStyleFlag)
    { return "red"; }
    else
    { return "blue"; }
  }


  setClickHandlerOnSlot(slotHtmlId) {

    //set click handler for  ship_slot
    (<any>$(document)).ready(() => {
      (<any>$("#"+slotHtmlId)).on("click", () => {
        alert("You clicked ship slot:" + slotHtmlId);
      });
    });
  }

  removeClickHandlerOnSlot(slotHtmlId) {

    //remove click handler for  ship_slot
    (<any>$(document)).ready(() =>  {
      (<any>$("#"+slotHtmlId)).off("click");
    });
  }


  setClickHandlerOnStone(stoneHtmlId:string) {

    //set click handler for  ship_slot
    (<any>$(document)).ready(() => {
      (<any>$("#"+stoneHtmlId)).on("click", () => {
        alert("You clicked stone: " + stoneHtmlId);
      });
    });
  }

  removeClickHandlerOnStone(stoneHtmlId) {

    //remove click handler for  ship_slot
    (<any>$(document)).ready(() =>  {
      (<any>$("#"+stoneHtmlId)).off("click");
    });
  }


  deactivateShipOnDepartingHarbour(ship_:Ship){


  }


  ractivateShipOnDepartingHarbour(ship_:Ship){

  }


  countStonesOnShip(ship_:Ship){

  }



  //Test
  //--------------------

  //this function is called from within Dragula drop
  //-----------------------------------------------
  addStoneToShip(htmlId:string){

    if(1){console.log("shipComponent:addStoneToShip:htmlId: ", htmlId)}
    //extract data from string
    let id=Number(htmlId.substring(htmlId.length-1,htmlId.length));
    let currentShip=Number(htmlId.substring(5,6));
    let currentStonePositionOnShip=Number(htmlId.substring(12,13));
    let colour_=htmlId.substring(14,16);
    let colour:ColourEnum;
    if(colour_=="bl"){
      colour=ColourEnum.black;
    }
    else if(colour_=="wh"){
      colour=ColourEnum.white;
    }
    else if(colour_=="br"){
      colour=ColourEnum.brown;
    }
    else if(colour_=="gr"){
      colour=ColourEnum.gray;
    }
    else {console.log("shipComponent error")}

    if(1){console.log(": ", htmlId.substring(htmlId.length-1,htmlId.length))}
    if(1){console.log(": ", htmlId)}
    if(1){console.log(": ", htmlId.substring(14,16))}

    //TODO: New stone object (better, take one from the sled?)
    let stone= new Stone(id, colour);

    //fill the array which creates the stone in slot
    this.stonesOnShip[currentShip-1][currentStonePositionOnShip-1] = stone;
  }

  stonesOnShip:Stone[][]=[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]];


  //TODO: here again we let Angular 2 add the stones to the site
  //Returns the array of stones in the ship
  // (but removes all null values)
  //---------------------------------------
  passStonesToSite(){
    let returnStones;

    for(let i = 0; i < 4; i++){
      if(this.stonesOnShip[i] != null){
        returnStones.append(this.stonesOnShip[i]);
      }

      return returnStones;
    }
  }

  //TODO: here again we let Angular 2 delete the stones from the ship
  //Deletes the contents of the stonesOnShip array
  // (use this after passing the stones to a site)
  emptyStoneArray(){
    this.stonesOnShip = [null, null, null, null];
  }


}
