import { Component, OnInit } from '@angular/core';
import {GameService} from "../../shared/services/game.service";
import {Ship} from "../../shared/models/ship";
import {RoundCard} from "../../shared/models/round-card";

@Component({
  selector: 'app-departing-harbour',
  templateUrl: './departing-harbour.component.html',
  styleUrls: ['./departing-harbour.component.css']
})

export class DepartingHarbourComponent {

  //ship objects
  ships:Ship[] = [];

  //roundCard object
  roundCard:RoundCard;

  //jQuery
  changeStyleFlag: boolean=false;


  constructor(private gameService: GameService) {

  }

  ngOnInit() {

    //get new round card from getNewRoundCardService (and backend)
    this.getNewRoundCard();

    //generate this.ships array with four ship objects
    this.generateFourShips();

  }

  //New Round Card
  getNewRoundCard(){

    //Fake Round Card to be replaced by above service
    let fourNewShips= new Array(4);
    for (let i=0; i < 4; i++){
      fourNewShips[i]=new Array(2)
    }

    fourNewShips[0][0]=1;
    fourNewShips[0][1]=4;
    fourNewShips[1][0]=2;
    fourNewShips[1][1]=3;
    fourNewShips[2][0]=3;
    fourNewShips[2][1]=2;
    fourNewShips[3][0]=4;
    fourNewShips[3][1]=1;

    //call getNewRoundCardService()
    //this.roundCard = new RoundCard(fourNewShips);
    console.log(fourNewShips[0]);
  }

  //New Ships
  generateFourShips(){

    //construct four ship objects with size
    /*let ship1 = new Ship(this.roundCard.shipId_1, this.roundCard.shipSize_1);
    let ship2 = new Ship(this.roundCard.shipId_2, this.roundCard.shipSize_1);
    let ship3 = new Ship(this.roundCard.shipId_3, this.roundCard.shipSize_1);
    let ship4 = new Ship(this.roundCard.shipId_4, this.roundCard.shipSize_1);*/

    let ship1 = new Ship(1, 4);
    let ship2 = new Ship(2, 3);
    let ship3 = new Ship(3, 2);
    let ship4 = new Ship(4, 1);

    //fill ships array
    this.ships.push(ship1);
    this.ships.push(ship2);
    this.ships.push(ship3);
    this.ships.push(ship4);
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


  //ng & Jquery drag & drop
  drag(ev) {
    console.log("1.event: " + ev );
    console.log("2.event.target.id: " + ev.target.id );

    ev.dataTransfer.setData("text", ev.target.id);
  }


  allowDrop(ev) {
    ev.preventDefault();
  }


  drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    console.log("3.data: "+data);
    console.log("4.event.target.id: " + ev.target.id );

    var isEmpty = ev.target.innerHTML === "";
    var isArrivingHarbour = document.getElementById(ev.target.id).parentElement.id === "arriving_harbours_";
    if(isEmpty && isArrivingHarbour) {
      ev.target.appendChild(document.getElementById(data));
      document.getElementById(data).ondragstart = function() { return false; };
    }

    console.log("5.data: "+data);
    console.log("6.document.getElementById(data).nodeName: " + document.getElementById(data).nodeName );
    console.log("7.document.getElementById(data).innerHTML: " + document.getElementById(data).innerHTML );
    console.log("8.event.target.id: " + ev.target.id );
    console.log("9.event.target.innerHTML: " + ev.target.innerHTML);
    console.log("10.event.target.hasChildNodes(): " + ev.target.hasChildNodes() );
    console.log("11.event.target.nodeName: " + ev.target.nodeName);
    console.log("12.document.getElementById(ev.target.id).nodeName: " + document.getElementById(ev.target.id).nodeName );
    console.log("13.document.getElementById(ev.target.id).parentElement.id: " + document.getElementById(ev.target.id).parentElement.id );
    console.log("14.document.getElementById(ev.target.id).parentNode.nodeName: " + document.getElementById(ev.target.id).parentNode.nodeName );
    console.log("15.event.target.innerHTML==='':" + isEmpty);
    console.log("16.document.getElementById(ev.target.id).parentElement.id: " + isArrivingHarbour);
  }

}
