import { Component, OnInit } from '@angular/core';

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


  //===============
  //Constructor
  //===============
  constructor() {

  }


  //==========
  // ngOnInit
  //==========

  ngOnInit() {
  }


  //===============
  // Other-Methods
  //===============

  setPlayerId(playerId:number){

    //1: white, 2:gray, 3:black, 4:brown
    this.playerId=playerId;
  }

}
