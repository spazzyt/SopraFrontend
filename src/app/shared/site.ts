import { Input } from '@angular/core';
import {Ship} from "../shared/models/ship";

export class Site {

  public ship:Ship;

  public siteName:string;

  constructor(siteName:string) {
    this.siteName = siteName;
    console.log("init site: ",siteName);
  }

  setShip(ship: Ship) {
    this.ship = ship;
  }
}
