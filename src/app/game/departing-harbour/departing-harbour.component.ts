import { Component, OnInit } from '@angular/core';
import {Ship} from "../../shared/models/ship";
import {RoundCard} from "../../shared/models/round-card";


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




}
