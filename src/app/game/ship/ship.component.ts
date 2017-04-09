import {Component, OnInit, Input} from '@angular/core';
import {Ship} from "../../shared/models/ship";
import {Stone} from "../../shared/models/stone";
import {ColourEnum} from "../../shared/models/colour.enum";

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


  //TODO: What is this for?
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


  //TODO: what should this function do? Dragula already place a stone to the Dom!
  //TODO: What we could do: If dragula drops a stone, I will remove it immediately
  //TODO: What we could do: Then I call addStoneToShip and let it Angular 2 do
  //--------------------------------
  addStoneToShip(htmlId:string){

    //extract data from string
    let id=Number(htmlId.substring(0,1));
    let currentStonePositionOnShip=0;
    let colour=ColourEnum.black;

    //TODO: New stone object (better, take one from the sled?)
    let stone= new Stone(id, colour);

    //fill the array which creates the stone in slot
    this.stonesOnShip[currentStonePositionOnShip-1] = stone;
  }


  //TODO: here again we let Angular 2 add the stones to the site
  //Returns the array of stones in the ship
  // (but removes all null values)
  //---------------------------------------
  passStonesToSite(){
    let returnStones;

    for(let i = 0; i < 4; i++){
      if(this.stonesOnShip[i] != null){
        returnStones.append(this.stonesOnShip[i]);
    }

    return returnStones;
    }
  }

  //TODO: here again we let Angular 2 delete the stones from the ship
  //Deletes the contents of the stonesOnShip array
  // (use this after passing the stones to a site)
  emptyStoneArray(){
    this.stonesOnShip = [null, null, null, null];
  }

  //TODO:
  deactivateOrActivateShips(){

  }




}
