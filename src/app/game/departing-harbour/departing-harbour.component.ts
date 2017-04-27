import { Component, OnInit,  Input } from '@angular/core';
import {Ship} from "../../shared/models/ship";
import {RoundCard} from "../../shared/models/round-card";
import {Stone} from "../../shared/models/stone";
import {ColourEnum} from "../../shared/models/colour.enum";


@Component({
  selector: 'app-departing-harbour',
  templateUrl: './departing-harbour.component.html',
  styleUrls: ['./departing-harbour.component.css']
})

export class DepartingHarbourComponent {

  //===============
  //Class Variables
  //===============

  //used to set the ships in a departing harbour slot
  @Input()
    ships: Ship[] = [];
  @Input()
    isActive: boolean;


  // used to set the stones on a ship slot
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

  // Remove Ship
  removeShip(shipid:number){
    //removes a ship with a given position from the departing harbour
    this.ships[shipid] = null;
  }



  // Generate Ships
  generateFourShips(ships_target: Ship[]){

    //fill ships array
    this.ships = ships_target;

  }

  // Remove Ships
  removeShips(){
    this.ships = [];
  }




  deactivateShipOnDepartingHarbour(ship_:Ship){


  }


  ractivateShipOnDepartingHarbour(ship_:Ship){

  }


  countStonesOnShip(ship_:Ship){

  }


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

    //TODO: New stone object (better, take one from the sled?)
    let stone= new Stone(id, colour);

    //fill the array which creates the stone in slot
    this.stonesOnShip[currentShip-1][currentStonePositionOnShip-1] = stone;

    if(1){console.log(": ", htmlId.substring(htmlId.length-1,htmlId.length))}
    if(1){console.log(": ", htmlId)}
    if(1){console.log(": ", htmlId.substring(14,16))}

  }


  //Returns the array of stones in the ship
  // (but removes all null values)
  //---------------------------------------
  passStonesToSite(whichShip:number){
    //let returnStones:Stone[]=[null,null,null,null];
    let returnStones=new Array<Stone>();

    for(let i = 0; i < 4; i++){
      if(this.stonesOnShip[i] != null){

        if(1){console.log(whichShip-1)};
        if(1){console.log(this.stonesOnShip[whichShip-1][i])};

        returnStones.push(this.stonesOnShip[whichShip-1][i]);
      }
    }
    if(1){console.log(returnStones)};
    return returnStones;
  }

  //Deletes the whole contents of the stonesOnShip array
  // (use this after passing the stones to a site)
  emptyStoneArray(whichShip:number){
    for(let i = 0; i < 4; i++) {
      if(this.stonesOnShip[i] != null) {
        this.stonesOnShip[whichShip-1][i] = null;
      }
    }
  }


  //ClickHandlers
  //-------------

  removeClickHandlerOnAllShips() {
    this.removeClickHandlerOnStonesOnShip(1);
    this.removeClickHandlerOnStonesOnShip(2);
    this.removeClickHandlerOnStonesOnShip(3);
    this.removeClickHandlerOnStonesOnShip(4);
  }

  setClickHandlerOnStonesOnShip(shipNumber) {
    this.setClickHandlerOnStone('ship_'+shipNumber+'_slot_1');
    this.setClickHandlerOnStone('ship_'+shipNumber+'_slot_2');
    this.setClickHandlerOnStone('ship_'+shipNumber+'_slot_3');
    this.setClickHandlerOnStone('ship_'+shipNumber+'_slot_4');
  }

  removeClickHandlerOnStonesOnShip(shipNumber) {
    this.removeClickHandlerOnStone('ship_'+shipNumber+'_slot_1');
    this.removeClickHandlerOnStone('ship_'+shipNumber+'_slot_2');
    this.removeClickHandlerOnStone('ship_'+shipNumber+'_slot_3');
    this.removeClickHandlerOnStone('ship_'+shipNumber+'_slot_4');
  }

  setClickHandlerOnStone(stoneHtmlId:string) {

    //set click handler for  ship_slot
    (<any>$(document)).ready(() => {
      (<any>$("#"+stoneHtmlId)).on("click", () => {
        alert("You clicked stone: " + stoneHtmlId);
      });
    });
  }

  removeClickHandlerOnStone(stoneHtmlId) {

    //remove click handler for  ship_slot
    (<any>$(document)).ready(() =>  {
      (<any>$("#"+stoneHtmlId)).off("click");
    });
  }



}
