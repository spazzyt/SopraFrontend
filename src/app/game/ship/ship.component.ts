import {Component, OnInit, Input} from '@angular/core';
import {Ship} from "../../shared/models/ship";
import {Stone} from "../../shared/models/stone";
import {ColourEnum} from "../../shared/models/colour.enum";

@Component({
  selector: 'app-ship',
  templateUrl: './ship.component.html',
  styleUrls: ['./ship.component.css']
})

//===========
// Component
//===========
export class ShipComponent implements OnInit {

  //===============
  //Class Variables
  //===============
  //input from parent: departing-harbour.component.html
  @Input() ship:Ship;
  //ship:Ship;



  //Add stones to ship
  //stonesOnShip: Stone[] = []; // = [new Stone(1, ColourEnum.brown), null]
  @Input() stonesOnShip:Stone[][];

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


  //TODO:
  deactivateOrActivateShips(){

  }




}
