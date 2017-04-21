import { Component, OnInit, Input } from '@angular/core';
import { DragulaService } from 'ng2-dragula/ng2-dragula';
import {Ship} from "../../shared/models/ship";


@Component({
  selector: 'final-destination',
  templateUrl: './final-destination.component.html',
  styleUrls: ['./final-destination.component.css']
})
export class FinalDestinationComponent implements OnInit {

  @Input()
  id: string;

  @Input()
  ship: Ship;

  constructor() {

  }

  ngOnInit() {
  }

  addTo($event: any) {
    let ship = $event.dragData;
    ship.isInHarbour = false;
    this.ship = ship;
    console.log("droped ship_ ", ship);
  }

}
