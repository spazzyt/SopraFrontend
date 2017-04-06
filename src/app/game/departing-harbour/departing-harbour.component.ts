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

    //Fake Ships
    let ship1 = new Ship(1, 4);
    let ship2 = new Ship(2, 3);
    let ship3 = new Ship(3, 2);
    let ship4 = new Ship(4, 1);

    this.generateFourShips(ship1, ship2, ship3, ship4);

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

}
