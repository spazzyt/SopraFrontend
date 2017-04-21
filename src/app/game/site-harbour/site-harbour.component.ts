import { Component, OnInit, Input } from '@angular/core';
import {PositionEnum} from "../../shared/models/position.enum";
import {Ship} from "../../shared/models/ship";
import {Stone} from "../../shared/models/stone";
import { DragulaService, DragulaModule } from 'ng2-dragula/ng2-dragula';


@Component({
  selector: 'app-site-harbour',
  templateUrl: './site-harbour.component.html',
  styleUrls: ['./site-harbour.component.css']
})

export class SiteHarbourComponent {

  //===============
  //Class Variables
  //===============
  @Input()
  ships: Ship[] = [];

  stonesOnShip:Stone[][]=[[null,null,null,null],[null,null,null,null],
    [null,null,null,null],[null,null,null,null]];

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

  addShipToHarbour(target: PositionEnum, ship: Ship){
      if(target == PositionEnum.Pyramid){
        this.ships[0] = ship;
      }
      else if(target == PositionEnum.Temple){
        this.ships[1] = ship;
      }
      else if(target == PositionEnum.BurialChamber){
        this.ships[2] = ship;
      }
      else if(target == PositionEnum.Obelisk){
        this.ships[3] = ship;
      }
  }

}
