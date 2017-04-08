import {Component, OnInit, Input} from '@angular/core';
import {Stone} from "../../shared/models/stone";

@Component({
  selector: 'app-stone',
  templateUrl: './stone.component.html',
  styleUrls: ['./stone.component.css']
})

//===========
// Component
//===========
export class StoneComponent implements OnInit {

  //===============
  //Class Variables
  //===============


  //playerId determines stone colour
  //1: white, 2:gray, 3:black, 4:brown
  playerId:number;
  //input from parent: site
  @Input() stone:Stone;
  //stone:Stone;


  //===============
  //Constructor
  //===============
  constructor() {
  }

  //===============
  //ngOnInit
  //===============
  ngOnInit() {
    this.showStoneInfo();
  }


  //===============
  // Other-Methods
  //===============

  showStoneInfo(){
    console.log(this.stone.colour)
    console.log(this.stone.id)
  }

  setPlayerId(playerId:number){

    //1: white, 2:gray, 3:black, 4:brown
    this.playerId=playerId;
  }

  //
  setClickHandlerOnStone(stoneHtmlId:string) {
    console.log("setClickHanlerOnStone:stoneHtmlId ",stoneHtmlId);

    //set click handler for  ship_slot
    (<any>$(document)).ready(() => {
      (<any>$("#"+stoneHtmlId)).on("click", () => {
        alert("You clicked market card in slot 1.");
      });
    });
  }

  removeClickHandlerOnStone(stoneHtmlId) {

    //remove click handler for  ship_slot
    (<any>$(document)).ready(function () {
      (<any>$("#"+stoneHtmlId)).off("click");
    });
  }


}
