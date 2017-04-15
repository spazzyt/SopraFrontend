import {Component, OnInit, ViewChild} from '@angular/core';
import {Stone} from "../../shared/models/stone";
import {Game} from "../../shared/models/game";
import {GameComponent} from "../game.component";

@Component({
  selector: 'app-temple',
  templateUrl: './temple.component.html',
  styleUrls: ['./temple.component.css']
})

//===========
// Component
//===========
export class TempleComponent implements OnInit {

  //===============
  //Class Variables
  //===============
  stones:Stone[] = [];
  fieldHeight:number[] = [0,0,0,0];
  totalStones:number = 0;
  numberOfPlayers:number = 4;
  fieldArray:number[] = [1,2,3,4];

  //==============
  // Event Emitter
  //==============


  //===============
  //Constructor
  //===============

  constructor() { }


  //==========
  // ngOnInit
  //==========

  ngOnInit() {
    //styles in styles.css at the end under popover, to style:
    //.popover .popover-title .popover-content .arrow

    //hover from top doesn't work properly
    (<any>$('#temple_points')).popover({
      placement: 'top',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      show: 5500,
      hide: 5500,
      html: true,
      content : 'Assess points at the end of every round' + '<br />' + 'Earn one point for each stone visible from above'
    });
    /* Stones total explanation */
    (<any>$('#total')).popover({
      placement: 'top',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      show: 5500,
      hide: 5500,
      html: true,
      content : 'The number indicates the total amount of stones.'
    });

    /* Level of stones explanation */
     (<any>$('#bottom')).popover({
     placement: 'top',
     trigger : 'hover',
     toggle: 'popover',
     title: '',
     show: 5500,
     hide: 5500,
     html: true,
     content : 'The numbers indicate how many stones' + '<br>' + 'are stacked on each other.'
     });


    if(this.numberOfPlayers > 2){       //if there are more than two players, a fifth field is added
      this.fieldArray = [1,2,3,4,5];
      this.fieldHeight = [0,0,0,0,0];
    }

  }

  //===============
  // Other-Methods
  //===============

  placeStones(targetStones: Stone[]){
    for (let i = 0; i < targetStones.length; i++) {
      if (targetStones[i] != null)                          //only do this for stones that exist in the input array
      {
                                                            //this function determines in which column the stone needs to be placed
        let x = this.totalStones % this.fieldHeight.length; //modulo calculates into which column to fill in the stone
        this.stones[x] = targetStones[i];

        //increase the total stone counter by one
        this.totalStones += 1;

        //increase the height display for each column where a new stone has been placed
        this.fieldHeight[x] += 1;
      }
    }

  }

  removeStones(){
    this.stones = [];
    this.totalStones = 0;
    this.fieldHeight = [0,0,0,0,0];

  }

  setAttributes(playerNumber: number){
    this.numberOfPlayers = playerNumber;
  }





}


