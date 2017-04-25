import {Component, OnInit, ViewChild, EventEmitter, Output} from '@angular/core';
import {Stone} from "../../shared/models/stone";
import {ColourEnum} from "../../shared/models/colour.enum";
import {GameComponent} from "../game.component";
import {Site} from "../../shared/site";

@Component({
  selector: 'app-obelisk',
  templateUrl: './obelisk.component.html',
  styleUrls: ['./obelisk.component.css']
})

//===========
// Component
//===========

export class ObeliskComponent extends Site implements OnInit {

  //===============
  //Class Variables
  //===============
  stones:number[] = [0,0,0,0];
  numberOfPlayers:number = 4;


  //==============
  // Event Emitter
  //==============

  @Output() onEvent_placeStones_stones = new EventEmitter<number[]>();
  @Output() onEvent_removeStones_stones = new EventEmitter<number[]>();

  @Output() onEvent_placeStones_withRedMarketCard_stones = new EventEmitter<number[]>();


  //===============
  //Constructor
  //===============

  constructor() {
    super("Obelisk");

    console.log("yo", this.myComp);
  }


  //==========
  // ngOnInit
  //==========

  ngOnInit() {
    //styles in styles.css at the end under popover, to style:
    //.popover .popover-title .popover-content .arrow

    //hover from top doesn't work properly
    (<any>$('#obelisk')).popover({
      placement: 'top',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      show: 5500,
      hide: 5500,
      html: true,
      content : 'Assess points at the end of the game'
    });


  }

  //===============
  // Other-Methods
  //===============

  //used for ship movements (with event listener)
  //---------------------------------------------
  placeStones(targetStones: Stone[]){
console.log("WHOAT")
    // FORMAT FOR stonenumbers Array
    // 0: black
    // 1: white
    // 2: brown
    // 3: gray

    let stoneNumbers:number[] = [0,0,0,0];    //temporary array for storing the number of stones in each color

    for (let i = 0; i < targetStones.length; i++){
      if(targetStones[i] != null)
      {
        if(targetStones[i].colour === ColourEnum.black){
          stoneNumbers[0] += 1;
        }
        else
        if(targetStones[i].colour === ColourEnum.white){
          stoneNumbers[1] += 1;
        }
        else
        if(targetStones[i].colour === ColourEnum.brown){
          stoneNumbers[2] += 1;
        }
        else
        if(targetStones[i].colour === ColourEnum.gray){
          stoneNumbers[3] += 1;
        }
      }
    }

    for (let i = 0; i < this.numberOfPlayers; i++) {
      this.stones[i] += stoneNumbers[i];
    }

    //inform Game Component about it
    //------------------------------
    this.onEvent_placeStones_stones.emit(this.stones);

  }

  //used red market card (without event listener)
  //---------------------------------------------
  placeStones_withRedCard(targetStones: Stone[]){

    // FORMAT FOR stonenumbers Array
    // 0: black
    // 1: white
    // 2: brown
    // 3: gray

    let stoneNumbers:number[] = [0,0,0,0];    //temporary array for storing the number of stones in each color

    for (let i = 0; i < targetStones.length; i++){
      if(targetStones[i] != null)
      {
        if(targetStones[i].colour === ColourEnum.black){
          stoneNumbers[0] += 1;
        }
        else
        if(targetStones[i].colour === ColourEnum.white){
          stoneNumbers[1] += 1;
        }
        else
        if(targetStones[i].colour === ColourEnum.brown){
          stoneNumbers[2] += 1;
        }
        else
        if(targetStones[i].colour === ColourEnum.gray){
          stoneNumbers[3] += 1;
        }
      }
    }

    for (let i = 0; i < this.numberOfPlayers; i++) {
      this.stones[i] += stoneNumbers[i];
    }

    //inform Game Component about it
    //------------------------------
    this.onEvent_placeStones_withRedMarketCard_stones.emit(this.stones);


  }


  removeStones(){
    this.stones = [0,0,0,0];

    //inform Game Component about it
    //------------------------------
    this.onEvent_removeStones_stones.emit(this.stones);
  }

  setAttributes(playerNumber: number){
    this.numberOfPlayers = playerNumber;
  }


}
