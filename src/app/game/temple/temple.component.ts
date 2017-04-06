import { Component, OnInit } from '@angular/core';
import {Stone} from "../../shared/models/stone";

@Component({
  selector: 'app-temple',
  templateUrl: './temple.component.html',
  styleUrls: ['./temple.component.css']
})
export class TempleComponent implements OnInit {


  stones:Stone[] = [];
  fieldHeight:number[] = [0,0,0,0,0];
  totalStones:number = 0;

  constructor() { }

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

  }


  placeStones(targetStones: Stone[]){
    for (var i = 0; i < targetStones.length; i++) {
      if(targetStones[i] != null) //only do this for stones that exist in the input array
      {
        //this function determines in which column the stone needs to be placed
        var x = this.totalStones % 5;
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

}
