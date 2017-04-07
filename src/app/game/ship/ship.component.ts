import {Component, OnInit, Input} from '@angular/core';
import {Ship} from "../../shared/models/ship";
import {Stone} from "../../shared/models/stone";

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

  stonesOnShip = new Array<Stone>(4);

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


  addStoneToShip(stone:Stone, positionOnShip:string){

    var pos = Number(positionOnShip.substring(12, 13));

    this.stonesOnShip[pos-1] = stone;
  }

  deactivateOrActivateShips(){

  }


  //Returns the array of stones in the ship (but removes all null values)
  passStonesToSite(){
    var returnStones;

    for(var i = 0; i < 4; i++){
      if(this.stonesOnShip[i] != null){
        returnStones.append(this.stonesOnShip[i]);
    }

    return returnStones;
    }
  }

  //Deletes the contents of the stonesOnShip array (use this after passing the stones to a site)
  emptyStoneArray(){
    this.stonesOnShip = [null, null, null, null];
  }


}
