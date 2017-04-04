import { Component, OnInit } from '@angular/core';
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

  placeStones(stonesToAdd: Stone[]){

    //fill stone array
    this.stones = stonesToAdd;
  }

}
