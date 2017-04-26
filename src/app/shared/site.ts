import {Input, ViewChild} from '@angular/core';
import {Ship} from "../shared/models/ship";
import {FinalDestinationComponent} from "../game/final-destination/final-destination.component";

export class Site {

  public ship:Ship;

  public siteName:string;

  public myComp;

  constructor(siteName:string) {
    this.siteName = siteName;
    this.myComp = this;
    console.log("init site: ",siteName);
  }

  setShip(ship: Ship) {
    this.ship = ship;
  }


  // Enable communication with FD Component
  @ViewChild(FinalDestinationComponent) finalDestinationComponent:any;

}
