import {Component, OnInit, Input} from '@angular/core';
import {Ship} from "../../shared/models/ship";
import {Stone} from "../../shared/models/stone";
import {ColourEnum} from "../../shared/models/colour.enum";
import {PositionEnum} from "../../shared/models/position.enum";
import {Move} from "../../shared/models/move";
import {GameService} from "../../shared/services/game.service";

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
  constructor(private gameService: GameService) {
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

  addTo($event: any, shipId: number, slotId: number) {
    let stone = $event.dragData;

    console.log("dropped stone_ ", stone, shipId, slotId);
    this.ship.addStoneById(stone, slotId);



    let moveToSend = new Move(null, PositionEnum.Sled, PositionEnum.ShipToken, slotId, null, shipId);
    this.gameService.sendMove(moveToSend);
  }
}
