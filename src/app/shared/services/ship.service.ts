import { Injectable } from '@angular/core';
import {Ship} from "../models/ship";


@Injectable()
export class ShipService {

  ships:Ship[] = [];

  constructor() { }

  setShips(ships: Ship[]){
    this.ships = ships;
  }

}
