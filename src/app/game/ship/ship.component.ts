import {Component, OnInit, Input} from '@angular/core';
import {Ship} from "../../shared/models/ship";

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
  //@Input() ship:Ship;
  ship:Ship;

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
}
