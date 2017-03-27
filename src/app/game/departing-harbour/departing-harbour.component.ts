import { Component, OnInit } from '@angular/core';
import {GameService} from "../../shared/services/game.service";

@Component({
  selector: 'app-departing-harbour',
  templateUrl: './departing-harbour.component.html',
  styleUrls: ['./departing-harbour.component.css']
})

export class DepartingHarbourComponent {

  changeStyleFlag: boolean=false;
  addContentFlag: boolean=false;
  removeContentFlag: boolean=false;
  changeContentFlag: boolean=false;


  constructor(private gameService: GameService) { }

  ngOnInit() {

    this.appendShipsToDepartingHarbours()
  }
  generateAppendShipNode(shipSize, shipImgNodeId, departingHarbourNodeId) {

    let departingHarbourNode = document.getElementById(departingHarbourNodeId);

    let shipImgNode = document.createElement("img");
    shipImgNode.id=shipImgNodeId;
    //shipImgNode.src="../../assets/ship_"+shipSize+".png"
    shipImgNode.src="../../../assets/images/ship_"+shipSize+".png"
    shipImgNode.draggable = true;

    shipImgNode.onload = function (ev) {

      this.addEventListener('dragstart', function () {drag(event)}, false);

      departingHarbourNode.appendChild(this);

      shipImgNode.style.position="relative";
      shipImgNode.style.height="50%";
      shipImgNode.style.top="25%";
      shipImgNode.style.left="10%";

      function drag(ev) {

        console.log("1.event: " + ev );
        console.log("2.event.target.id: " + ev.target.id );

        ev.dataTransfer.setData("text", ev.target.id);
      }
    }
  }

  appendShipsToDepartingHarbours(){
    this.generateAppendShipNode("1", "ship_1_", "departing_harbour_1_");
    this.generateAppendShipNode("2", "ship_2_", "departing_harbour_2_");
    this.generateAppendShipNode("3", "ship_3_", "departing_harbour_3_");
    this.generateAppendShipNode("4", "ship_4_", "departing_harbour_4_");
  }


  removeShipNode(shipImgNodeId){
    let shipNodetoBeRemoved = document.getElementById(shipImgNodeId);
    shipNodetoBeRemoved.parentNode.removeChild(shipNodetoBeRemoved);
  }

  changeContent(oldShipImgNodeId, newShipSize, newShipImgNodeId, departingHarbourNodeId){
    this.removeShipNode(oldShipImgNodeId);
    this.generateAppendShipNode(newShipSize, newShipImgNodeId, departingHarbourNodeId)
  }

  removeAllContent(parentNodeId){
    let node=document.getElementById(parentNodeId);
    while (node.firstChild){
      node.removeChild(node.firstChild);
    }
  }

  removeAllContentFromDepartingHarbours(){
    this.removeAllContent('departing_harbour_1_');
    this.removeAllContent('departing_harbour_2_');
    this.removeAllContent('departing_harbour_3_');
    this.removeAllContent('departing_harbour_4_');
  }

  removeAllContentFromArrivingHarbours(){
    this.removeAllContent('arriving_harbour_1_');
    this.removeAllContent('arriving_harbour_2_');
    this.removeAllContent('arriving_harbour_3_');
    this.removeAllContent('arriving_harbour_4_');
    this.removeAllContent('arriving_harbour_5_');
  }

  toggleStyle(){
    this.changeStyleFlag =! this.changeStyleFlag;

  }

  changeBGColourStyle() {
    if(this.changeStyleFlag)
    { return "red"; }
    else
    { return "blue"; }
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
