import { Component, OnInit,  Input } from '@angular/core';
import {Ship} from "../../shared/models/ship";
import {RoundCard} from "../../shared/models/round-card";
import {Stone} from "../../shared/models/stone";
import {ColourEnum} from "../../shared/models/colour.enum";
import {Move} from "../../shared/models/move";


@Component({
  selector: 'app-departing-harbour',
  templateUrl: './departing-harbour.component.html',
  styleUrls: ['./departing-harbour.component.css']
})

export class DepartingHarbourComponent {

  //===============
  //Class Variables
  //===============

  //used to set the ships in a departing harbour slot
  @Input()
    ships: Ship[] = [];
  @Input()
    isActive: boolean;

  @Input()
    gameComp: any;

  @Input()
    hammerPlayed: boolean;
  @Input()
    chiselPlayed: boolean;
  @Input()
    sailPlayed: boolean;
  @Input()
    sailMove: Move;


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
