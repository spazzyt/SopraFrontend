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
  ships:Ship[] = [];
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
  generateFourShips(ship1, ship2, ship3, ship4){

    //fill ships array
    this.ships.push(ship1);
    this.ships.push(ship2);
    this.ships.push(ship3);
    this.ships.push(ship4);
  }

  // Remove Ships
  removeShips(){

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

}
