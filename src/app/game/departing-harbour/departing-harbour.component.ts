import { Component, OnInit } from '@angular/core';
import {GameService} from "../../shared/services/game.service";

@Component({
  selector: 'app-departing-harbour',
  templateUrl: './departing-harbour.component.html',
  styleUrls: ['./departing-harbour.component.css']
})

export class DepartingHarbourComponent {

  constructor(private gameService: GameService) { }

  ngOnInit() {
    let round_card = this.gameService.getRoundCard();
    this.ships_to_harbour(round_card);
  }

  ships_to_harbour(round_card){
    document.getElementById("departing_harbour_1").appendChild(round_card[0]);
    document.getElementById("departing_harbour_2").appendChild(round_card[1]);
    document.getElementById("departing_harbour_3").appendChild(round_card[2]);
    document.getElementById("departing_harbour_4").appendChild(round_card[3]);
  }


  allowDrop(ev) {
    ev.preventDefault();
  }

  drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);

  }

  drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");

    var isEmpty = ev.target.innerHTML === "";
    var isArrivingHarbour = document.getElementById(ev.target.id).parentElement.id === "arriving_harbours";
    if(isEmpty && isArrivingHarbour) {
      ev.target.appendChild(document.getElementById(data));
      document.getElementById(data).ondragstart = function() { return false; };
    }

    console.log("data: "+data);
    console.log("event.target.id: " + ev.target.id );
    console.log("event.target.innerHTML: " + ev.target.innerHTML);
    console.log("event.target.hasChildNodes(): " + ev.target.hasChildNodes() );
    console.log("document.getElementById(ev.target.id).parentElement.id: " + document.getElementById(ev.target.id).parentElement.id );
    console.log("document.getElementById(ev.target.id).parentNode.nodeName: " + document.getElementById(ev.target.id).parentNode.nodeName );
    console.log("event.target.innerHTML==='':" + isEmpty);
    console.log("document.getElementById(ev.target.id).parentElement.id: " + isArrivingHarbour);

  }


}
