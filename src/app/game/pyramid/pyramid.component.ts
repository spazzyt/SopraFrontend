import { Component, OnInit } from '@angular/core';
import {Stone} from "../../shared/models/stone";

@Component({
  selector: 'app-pyramid',
  templateUrl: './pyramid.component.html',
  styleUrls: ['./pyramid.component.css']
})
export class PyramidComponent implements OnInit {

  stones:Stone[] = [];
  totalStones:number = 0;


  constructor() { }

  ngOnInit() {
    //styles in styles.css at the end under popover, to style:
    //.popover .popover-title .popover-content .arrow

    //hover from top doesn't work properly
    (<any>$('#pyramid')).popover({
      placement: 'top',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      show: 5500,
      hide: 5500,
      html: true,
      content : 'Assess points immediately when placing the stone'
    });
  }


  placeStones(targetStones: Stone[]){
    for (var i = 0; i < targetStones.length; i++) {

      if(this.totalStones < 14) {

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

}
