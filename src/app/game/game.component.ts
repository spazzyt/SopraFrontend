import { Component, OnInit } from '@angular/core';
import {UserService} from "../shared/services/user.service";
import {User} from "../shared/models/user";
import {DragulaService} from "ng2-dragula";
import {GameService} from "../shared/services/game.service";
import {RoundCard} from "../shared/models/round-card";
import {Ship} from "../shared/models/ship";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent  implements OnInit {

  //===============
  //Class Variables
  //===============
  users: User[] = [];
  ships:Ship[] = [];
  roundCard:RoundCard;
  changeStyleFlag: boolean=false;  //jQuery

  //===============
  //Constructor
  //===============
  constructor(private userService: UserService,
              private gameService: GameService,
              private dragulaService: DragulaService) {

    try {
      dragulaService.setOptions('harbours_bag', {
        accepts: function (el, target, source, sibling) {

          let isEmpty = target.innerHTML === "";
          let isArrivingHarbour = target.parentElement.id === "arriving_harbours";

          /*Debugging
           console.log("10.1.1 ", `el: ${el}`); //moved element
           console.log("10.1.2 ", `el.id: ${el.id}`); //its id
           console.log("10.2.1 ", `source: ${source}`); //source element
           console.log("10.2.2 ", `source.id: ${source.id}`); //its id
           console.log("10.2.1 ", `sibling: ${sibling}`);
           console.log("10.3.1 ", `target: ${target}`); //target element
           console.log("10.3.2 ", `target.id: ${target.id}`); //its id
           console.log("10.3.3 ", `target.innerHTML: ${target.innerHTML}`); //its innerHTML
           console.log("10.4.1 ", `target.parentElement: ${target.parentElement}`);
           console.log("10.4.2 ", `target.parentElement.id: ${target.parentElement.id}`);
           console.log("10.5.1 ", "isEmpty: " ,isEmpty);
           console.log("10.5.2 ", "isArrivingHarbour: " ,isArrivingHarbour);
           */

          if (isEmpty && isArrivingHarbour) {
            console.log("10.6.1 ", "====HARBOUR=TRUE=====");
            return true;
          }
          else {
            console.log("10.6.2 ", "====HARBOUR=FALSE=====");
            return false;
          }
        },

        moves: function (el, source, handle, sibling) {
          return true; //rue: elements are always draggable by default
        },

        isContainer: function (el) {
          return false;  //only elements in drake.containers will be taken into account
        },

        invalid: function (el, handle) {

          let isArrivingHarbour = el.parentElement.parentElement.id === "arriving_harbours";
          let isInvalid = isArrivingHarbour;

          if (isInvalid) {
            console.log("10.10.1 ", "-----TRUE-----");
            return true;
          }
          else {
            console.log("10.10.2 ", "-----FALSE-----");
            return false; //false: don't prevent any drags from initiating by default
          }


        },

        direction: 'vertical',  //X (horizontal) or Y axis (vertical) is considered when determining where an element would be dropped

        copy: function (el, source) {

          let isCopyClass = el.classList.contains('you-may-copy-us'); //the css class name
          let isCopyId = el.id === '#you-may-copy-me'; //the css id; but use a className for this

          /*Debugging
           console.log("10.15.1 ", `el.id: ${el.id}`); //moved element
           console.log("10.15.2 ", `el.className: ${el.className}`);
           console.log("10.15.1 ", `el.isCopyClass: ${isCopyClass}`);
           console.log("10.15.2 ", `el.isCopyId: ${isCopyId}`);
           */

          if (isCopyClass || isCopyId) {
            console.log("10.16.1 ", "-----TRUE-----");
            return true;
          }
          else {
            console.log("10.16.2 ", "-----FALSE-----");
            return false;
          }

        },

        revertOnSpill: false, //spilling will put the element back where it was dragged from, if this is true

        removeOnSpill: false, //spilling will `.remove` the element, if this is true

      });


      dragulaService.setOptions('stone_slots_bag', {

        accepts: function (el, target, source, sibling) {

          let isEmpty = target.innerHTML === "";
          let isStoneSlot_1 = target.parentElement.id === "ship_1_slots";
          let isStoneSlot_2 = target.parentElement.id === "ship_2_slots";
          let isStoneSlot_3 = target.parentElement.id === "ship_3_slots";
          let isStoneSlot_4 = target.parentElement.id === "ship_4_slots";

          /*Debugging:
           console.log("11.1.1 ", `el: ${el}`); //moved element
           console.log("11.1.2 ", `el.id: ${el.id}`); //its id
           console.log("11.2.1 ", `source: ${source}`); //source element
           console.log("11.2.2 ", `source.id: ${source.id}`); //its id
           console.log("11.2.1 ", `sibling: ${sibling}`);
           console.log("11.3.1 ", `target: ${target}`); //target element
           console.log("11.3.2 ", `target.id: ${target.id}`); //its id
           console.log("11.3.3 ", `target.innerHTML: ${target.innerHTML}`); //its innerHTML
           console.log("11.4.1 ", `target.parentElement: ${target.parentElement}`);
           console.log("11.4.2 ", `target.parentElement.id: ${target.parentElement.id}`);
           console.log("11.5.1 ", "isEmpty: " ,isEmpty);
           console.log("11.5.2 ", "isStoneSlot_1: " ,isStoneSlot_1);
           console.log("11.5.3 ", "isStoneSlot_2: " ,isStoneSlot_2);
           console.log("11.5.4 ", "isStoneSlot_3: " ,isStoneSlot_3);
           console.log("11.5.5 ", "isStoneSlot_4: " ,isStoneSlot_4);
           */

          if (isEmpty && (isStoneSlot_1 || isStoneSlot_2 || isStoneSlot_3 || isStoneSlot_4 )) {
            console.log("11.6.1 ", "====SLOT=TRUE=====");
            return true;
          }
          else {
            console.log("11.6.2 ", "====SLOT=FALSE=====");
            return false;
          }
          ;

        },

        moves: function (el, source, handle, sibling) {
          return true; //true: elements are always draggable by default
        },

        isContainer: function (el) {
          return false;  //only elements in drake.containers will be taken into account
        },

        invalid: function (el, handle) {

          let isStoneSlot = el.parentElement.parentElement.classList.contains('ship_slots');
          let isInvalid = isStoneSlot;

          if (isInvalid) {
            console.log("10.10.1 ", "-----TRUE-----");
            /**/
            return true;
          }
          else {
            console.log("10.10.2 ", "-----FALSE-----");
            /**/
            return false; //false: don't prevent any drags from initiating by default
          }

        },

        direction: 'vertical',  //X (horizontal) or Y axis (vertical) is considered when determining where an element would be dropped

        //copy: true, //false: elements are moved by default, not copied. true: copies el to target and leaves it in source
        copy: function (el, source) {

          let isCopyClass = el.classList.contains('you-may-copy-us'); //the css class name
          let isCopyId = el.id === '#you-may-copy-me'; //the css id; but use a className for this

          /*Debugging
           console.log("11.15.1 ", `el.id: ${el.id}`); //moved element
           console.log("11.15.2 ", `el.className: ${el.className}`);
           console.log("11.15.1 ", `el.isCopyClass: ${isCopyClass}`);
           console.log("11.15.2 ", `el.isCopyId: ${isCopyId}`);
           */

          if (isCopyClass || isCopyId) {
            console.log("11.16.1 ", "----COPY-TRUE-----");
            return true;
          }
          else {
            console.log("11.16.2 ", "----COPY-FALSE-----");
            return false;
          }

        },

        revertOnSpill: false, //spilling will put the element back where it was dragged from, if this is true

        removeOnSpill: false, // spilling will `.remove` the element, if this is true

      });


      dragulaService.drag.subscribe((value) => {

        /*Debugging
         console.log("6.1.1.1 ", `drag: ${value}`);
         console.log("6.1.1.2 ", `drag: ${value[0]}`);
         console.log("6.1.1.3 ", `drag: ${value.slice(1)}`);
         */

        //custom code
      });

      dragulaService.drop.subscribe((value) => {

        /*Debugging
         console.log("6.2.1.1 ", `drop: ${value}`);
         console.log("6.2.1.2 ", `drop: ${value[0]}`);
         console.log("6.2.1.3 ", `drop: ${value.slice(1)}`);
         */

        // Custom code here

      });
    }
    finally{}
  }

  ngOnInit() {
    // get users from secure api end point
    this.userService.getUsers()
      .subscribe(users => {
        this.users = users;
      });
  }

}
