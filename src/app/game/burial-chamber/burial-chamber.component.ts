import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {Stone} from "../../shared/models/stone";

@Component({
  selector: 'app-burial-chamber',
  templateUrl: './burial-chamber.component.html',
  styleUrls: ['./burial-chamber.component.css']
})
export class BurialChamberComponent implements OnInit {

  //===============
  //Class Variables
  //===============

  stones:Stone[] = [];
  totalStones:number = 0;


  //===============
  //Constructor
  //===============
  constructor() { }

  ngOnInit() {
    //styles in styles.css at the end under popover, to style:
    //.popover .popover-title .popover-content .arrow

    //hover from top doesn't work properly
    (<any>$('#burial')).popover({
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

  placeStones(targetStones: Stone[]){
    for (let i = 0; i < targetStones.length; i++) {

      if(this.totalStones < 27) {

        if (targetStones[i] != null) //only do this for stones that exist in the input array
        {
          //this function determines in which column the stone needs to be placed
          this.stones[this.totalStones] = targetStones[i];

          //increase the total stone counter by one
          this.totalStones += 1;
        }
      }
    }
  }


  removeStones(){
    this.stones = [];
    this.totalStones = 0;
  }

}
