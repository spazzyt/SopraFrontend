import { Component, OnInit } from '@angular/core';
import {Stone} from "../../shared/models/stone";
import {ColourEnum} from "../../shared/models/colour.enum";

@Component({
  selector: 'app-obelisk',
  templateUrl: './obelisk.component.html',
  styleUrls: ['./obelisk.component.css']
})
export class ObeliskComponent implements OnInit {




  stones:number[] = [0,0,0,0];
  numberOfPlayers:number = 4;

  constructor() {}

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

  placeStones(targetStones: Stone[]){

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
  }


  removeStones(){
    this.stones = [0,0,0,0];
  }

  setAttributes(playerNumber: number){
    this.numberOfPlayers = playerNumber;
  }


}
