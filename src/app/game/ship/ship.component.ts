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

  //Add stones to ship
  //stonesOnShip: Stone[] = []; // = [new Stone(1, ColourEnum.brown), null]
  @Input() stonesOnShip:Stone[][];

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

  //this function is called from within Dragula drop
  //-----------------------------------------------
  addStoneToShip(htmlId:string){

    if(1){console.log("shipComponent:addStoneToShip:htmlId: ", htmlId)}
    //extract data from string
    let id=Number(htmlId.substring(htmlId.length-1,htmlId.length));
    let currentShip=Number(htmlId.substring(5,6));
    let currentStonePositionOnShip=Number(htmlId.substring(12,13));
    let colour_=htmlId.substring(14,16);
    let colour:ColourEnum;
    if(colour_=="bl"){
      colour=ColourEnum.black;
    }
    else if(colour_=="wh"){
      colour=ColourEnum.white;
    }
    else if(colour_=="br"){
      colour=ColourEnum.brown;
    }
    else if(colour_=="gr"){
      colour=ColourEnum.gray;
    }
    else {console.log("shipComponent error")}

    if(1){console.log(": ", htmlId.substring(htmlId.length-1,htmlId.length))}
    if(1){console.log(": ", htmlId)}
    if(1){console.log(": ", htmlId.substring(14,16))}

    //TODO: New stone object (better, take one from the sled?)
    let stone= new Stone(id, colour);

    //fill the array which creates the stone in slot
    this.stonesOnShip[1][currentStonePositionOnShip-1] = stone;
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
