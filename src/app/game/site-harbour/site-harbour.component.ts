import { Component, OnInit } from '@angular/core';
import {PositionEnum} from "../../shared/models/position.enum";
import {Ship} from "../../shared/models/ship";

@Component({
  selector: 'app-site-harbour',
  templateUrl: './site-harbour.component.html',
  styleUrls: ['./site-harbour.component.css']
})

export class SiteHarbourComponent {

  //===============
  //Class Variables
  //===============
  ships: Ship[] = [];


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

  addShipToHarbour(target: PositionEnum, shipid: number){
      if(target == PositionEnum.Pyramid){

      }
      else if(target == PositionEnum.Pyramid){

      }
      else if(target == PositionEnum.Temple){

      }
      else if(target == PositionEnum.BurialChamber){

      }
      else if(target == PositionEnum.Obelisk){

      }
      else if(target == PositionEnum.Market){

      }
  }

}
