import {Component, OnInit, Input, Injector} from '@angular/core';
import { DragulaService } from 'ng2-dragula/ng2-dragula';
import {Ship} from "../../shared/models/ship";
import {Move} from "../../shared/models/move";
import {GameService} from "../../shared/services/game.service";
import {PositionEnum} from "../../shared/models/position.enum";


@Component({
  selector: 'final-destination',
  templateUrl: './final-destination.component.html',
  styleUrls: ['./final-destination.component.css']
})
export class FinalDestinationComponent implements OnInit {

  @Input()
  id: PositionEnum;

  @Input()
  ship: Ship;

  @Input()
  parent;

  constructor(private gameService: GameService,
           private inj:Injector) {



  }

  ngOnInit() {

    console.log(this.parent);
  }

  addTo($event: any) {
    let ship = $event.dragData;
    ship.isInHarbour = false;
    this.ship = ship;
    console.log("dropped ship_ ", ship);

    this.parent.placeStones(this.ship.slots);
    this.ship.slots = null;

    let moveToSend = new Move(PositionEnum.DepartingHarbour, this.id, ship.id);
    this.gameService.sendMove(moveToSend)
  }

}
