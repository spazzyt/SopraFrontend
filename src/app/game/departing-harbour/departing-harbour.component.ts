import {Component, OnInit, Input} from '@angular/core';
import {Ship} from "../../shared/models/ship";
import {RoundCard} from "../../shared/models/round-card";
import {GameService} from "../../shared/services/game.service";
import {Response} from "@angular/http";
import {Observable} from "rxjs";


@Component({
  selector: 'app-departing-harbour',
  templateUrl: './departing-harbour.component.html',
  styleUrls: ['./departing-harbour.component.css']
})

export class DepartingHarbourComponent {

  //===============
  //Class Variables
  //===============

  //input from parent: game.component.html
  @Input() ships:Ship[];

  //not used yet
  changeStyleFlag: boolean=false;  //jQuery

  //===============
  //Constructor
  //===============
  constructor(private gameService: GameService) {

  }

  //===============
  //ngOnInit
  //===============

  ngOnInit() {
    //this.gameService.getShips();
    //generate this.ships array with four ship objects
    //this.generateFourShips();

  }

  //===============
  //Class Methods
  //===============

  // Remove Ships
  removeShips(){

  }



  // New Ships
  generateFourShips(){

    //Fake Ships
    let ship1 = new Ship(1, 4);
    let ship2 = new Ship(2, 3);
    let ship3 = new Ship(3, 2);
    let ship4 = new Ship(4, 1);

    //fill ships array
   // this.ships.push(ship1);
   // this.ships.push(ship2);
   // this.ships.push(ship3);
   // this.ships.push(ship4);
  }

  //change Style
  toggleStyle(){
    this.changeStyleFlag =! this.changeStyleFlag;
  }

  changeBGColourStyle() {
    if(this.changeStyleFlag)
    { return "red"; }
    else
    { return "blue"; }
  }

}
