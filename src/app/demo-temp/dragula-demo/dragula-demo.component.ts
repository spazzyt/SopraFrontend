import { Component, OnInit } from '@angular/core';
import {DragulaService, dragula} from "ng2-dragula";


@Component({
  selector: 'app-dragula-demo',
  templateUrl: 'dragula-demo.component.html',
  styleUrls: ['dragula-demo.component.css']
})


export class DragulaDemoComponent implements OnInit {

  //ex.1 / 5 / 7: Data structure for (ngFor)
  public groups: Array<any> = [
    {
      name: 'Group A',
      items: [{name: 'Item A'},{name: 'Item B'},{name: 'Item C'},{name: 'Item D'}]
    },
    {
      name: 'Group B',
      items: [{name: 'Item 1'},{name: 'Item 2'},{name: 'Item 3'},{name: 'Item 4'}]
    }
  ];

  //ex.9
  public list: Array<any> = [
    {id: 1, name: 'Item A'},
    {id: 2, name: 'Item B'},
    {id: 3, name: 'Item C'},
    {id: 4, name: 'Item D'}
  ];


  //ex.7 set options variable
  option_8_1: any = {
    removeOnSpill: true
  };


  constructor(private dragulaService: DragulaService) {

    //ex.4: set invalid option on class of item/el in drake
    dragulaService.setOptions('group_4', {
      invalid: (el, handle) => {
        el.classList.contains('doNotDrag')
        //console.log("4.1 ",el,handle);
        console.log("4.1 ");
      }
    });

    //ex.5: (start debug mode in chromium)
    dragulaService.setOptions('nested-bag_5', {
      revertOnSpill: true,
      moves: function (el:any, container:any, handle:any):any {
        //debugger /* starts debug mode in chromium */
        //console.log("5.1 ",el, container,handle);
        console.log("5.1 ");
        return false;
      }
    });


    //ex.10 (dragula does not work, only ng2-dragula)

    dragulaService.setOptions('harbours_bag', {
      accepts: function (el, target, source, sibling) {
        console.log("10.1.1 ", `el: ${el}`); /*moved element*/
        console.log("10.1.2 ", `el.id: ${el.id}`); /*its id*/

        console.log("10.2.1 ", `source: ${source}`); /*source element */
        console.log("10.2.2 ", `source.id: ${source.id}`); /*its id*/

        console.log("10.2.1 ", `sibling: ${sibling}`); /**/

        console.log("10.3.1 ", `target: ${target}`); /*target element*/
        console.log("10.3.2 ", `target.id: ${target.id}`); /*its id */
        console.log("10.3.3 ", `target.innerHTML: ${target.innerHTML}`); /*its innerHTML*/

        console.log("10.4.1 ", `target.parentElement: ${target.parentElement}`); /**/
        console.log("10.4.2 ", `target.parentElement.id: ${target.parentElement.id}`); /**/

        let isEmpty = target.innerHTML === "";
        let isArrivingHarbour = target.parentElement.id === "arriving_harbours";
        console.log("10.5.1 ", "isEmpty: " ,isEmpty); /**/
        console.log("10.5.2 ", "isArrivingHarbour: " ,isArrivingHarbour); /**/

        if(isEmpty && isArrivingHarbour) {
          console.log("10.6.1 ", "====HARBOUR=TRUE====="); /**/
          return true;
        }
        else{
          console.log("10.6.2 ", "====HARBOUR=FALSE====="); /**/
          return false;
        }
        //return (target.id != "arriving_harbour_2"); /*disallows drop into arriving_harbour_2 */
      },

      moves: function (el, source, handle, sibling) {
        return true; /* true: elements are always draggable by default */
        //return el.tagName.toLowerCase() === 'mvp-navigation-item'; /*only move favorite items, not the icon element */
      },

      isContainer: function (el) {
        return false;  /* only elements in drake.containers will be taken into account */
      },

      invalid: function (el, handle) {

        let isArrivingHarbour = el.parentElement.parentElement.id === "arriving_harbours";
        let isInvalid = isArrivingHarbour;

        if(isInvalid) {
          console.log("10.10.1 ", "-----TRUE-----"); /**/
          return true;
        }
        else{
          console.log("10.10.2 ", "-----FALSE-----"); /**/
          return false; /* false: don't prevent any drags from initiating by default */
        }


      },

      direction: 'vertical',  /*X (horizontal) or Y axis (vertical) is considered when determining where an element would be dropped*/

      //copy: false, /*false: elements are moved by default, not copied. true: copies el to target and leaves it in source*/
      copy:function (el, source) {

        let isCopyClass = el.classList.contains('you-may-copy-us'); /*the css class name*/
        let isCopyId = el.id === '#you-may-copy-me'; /*the css id; but use a className for this*/
        console.log("10.15.1 ", `el.id: ${el.id}`); /*moved element*/
        console.log("10.15.2 ", `el.className: ${el.className}`); /* */
        console.log("10.15.1 ", `el.isCopyClass: ${isCopyClass}`); /* */
        console.log("10.15.2 ", `el.isCopyId: ${isCopyId}`); /* */

        if(isCopyClass || isCopyId) {
          console.log("10.16.1 ", "-----TRUE-----"); /**/
          return true;
        }
        else{
          console.log("10.16.2 ", "-----FALSE-----"); /**/
          return false;
        }

      },

      revertOnSpill: false, /* spilling will put the element back where it was dragged from, if this is true*/

      removeOnSpill: false, /* spilling will `.remove` the element, if this is true */

    });


    //ex.11
    dragulaService.setOptions('stone_slots_bag', {

      accepts: function (el, target, source, sibling) {
        console.log("11.1.1 ", `el: ${el}`); /*moved element*/
        console.log("11.1.2 ", `el.id: ${el.id}`); /*its id*/

        console.log("11.2.1 ", `source: ${source}`); /*source element */
        console.log("11.2.2 ", `source.id: ${source.id}`); /*its id*/

        console.log("11.2.1 ", `sibling: ${sibling}`); /**/

        console.log("11.3.1 ", `target: ${target}`); /*target element*/
        console.log("11.3.2 ", `target.id: ${target.id}`); /*its id */
        console.log("11.3.3 ", `target.innerHTML: ${target.innerHTML}`); /*its innerHTML*/

        console.log("11.4.1 ", `target.parentElement: ${target.parentElement}`); /**/
        console.log("11.4.2 ", `target.parentElement.id: ${target.parentElement.id}`); /**/

        let isEmpty = target.innerHTML === "";
        let isStoneSlot_1 = target.parentElement.id === "ship_1_slots";
        let isStoneSlot_2 = target.parentElement.id === "ship_2_slots";
        let isStoneSlot_3 = target.parentElement.id === "ship_3_slots";
        let isStoneSlot_4 = target.parentElement.id === "ship_4_slots";
        console.log("11.5.1 ", "isEmpty: " ,isEmpty); /**/
        console.log("11.5.2 ", "isStoneSlot_1: " ,isStoneSlot_1); /**/
        console.log("11.5.3 ", "isStoneSlot_2: " ,isStoneSlot_2); /**/
        console.log("11.5.4 ", "isStoneSlot_3: " ,isStoneSlot_3); /**/
        console.log("11.5.5 ", "isStoneSlot_4: " ,isStoneSlot_4); /**/

        if(isEmpty && (isStoneSlot_1 || isStoneSlot_2 || isStoneSlot_3 || isStoneSlot_4 )) {
          console.log("11.6.1 ", "====SLOT=TRUE====="); /**/
          return true;
        }
        else{
          console.log("11.6.2 ", "====SLOT=FALSE====="); /**/
          return false;
        }
        //return (target.id != "arriving_harbour_2"); /*disallows drop into arriving_harbour_2 */
      },

      moves: function (el, source, handle, sibling) {
        return true; /* true: elements are always draggable by default */
        //return el.tagName.toLowerCase() === 'mvp-navigation-item'; /*only move favorite items, not the icon element */
      },

      isContainer: function (el) {
        return false;  /* only elements in drake.containers will be taken into account */
      },

      invalid: function (el, handle) {

        let isStoneSlot = el.parentElement.parentElement.classList.contains('ship_slots');
        let isInvalid = isStoneSlot;

        if(isInvalid) {
          console.log("10.10.1 ", "-----TRUE-----"); /**/
          return true;
        }
        else{
          console.log("10.10.2 ", "-----FALSE-----"); /**/
          return false; /* false: don't prevent any drags from initiating by default */
        }

      },

      direction: 'vertical',  /*X (horizontal) or Y axis (vertical) is considered when determining where an element would be dropped*/

      //copy: true, /*false: elements are moved by default, not copied. true: copies el to target and leaves it in source*/
      copy:function (el, source) {

        let isCopyClass = el.classList.contains('you-may-copy-us'); /*the css class name*/
        let isCopyId = el.id === '#you-may-copy-me'; /*the css id; but use a className for this*/
        console.log("11.15.1 ", `el.id: ${el.id}`); /*moved element*/
        console.log("11.15.2 ", `el.className: ${el.className}`); /* */
        console.log("11.15.1 ", `el.isCopyClass: ${isCopyClass}`); /* */
        console.log("11.15.2 ", `el.isCopyId: ${isCopyId}`); /* */

        if(isCopyClass || isCopyId) {
          console.log("11.16.1 ", "----COPY-TRUE-----"); /**/
          return true;
        }
        else{
          console.log("11.16.2 ", "----COPY-FALSE-----"); /**/
          return false;
        }

      },

      revertOnSpill: false, /* spilling will put the element back where it was dragged from, if this is true*/

      removeOnSpill: false, /* spilling will `.remove` the element, if this is true */

    });


    //ex.9
    dragulaService.setOptions('foo-list', {
      moves: (el, source, handle, sibling) => !el.classList.contains('ignore'),
      accepts: (el, target, source, sibling) => sibling === null || !sibling.classList.contains('ignore'),
      direction: 'horizontal'
    });

    //ex.6 / 9: Events
    dragulaService.drag.subscribe((value) => {
      console.log("6.1.1.1 ", `drag: ${value}`);
      console.log("6.1.1.2 ", `drag: ${value[0]}`);
      console.log("6.1.1.3 ", `drag: ${value.slice(1)}`);

      if(value[0]=="foo-list_9"){
        console.log("6.1.2.1 ", `drag: ${value[1]}`);//LI list element
        console.log("6.1.2.2 ", `drag: ${value[1].dataset.id}`);
        console.log("6.1.2.3 ", `drag: ${value[2]}`);//UL list parent

        //custom code
        this.onDrag(value.slice(1));

      }
      else{
        console.log("6.1.3 ", `drag: ${value[0]}`);
      }
    });

    dragulaService.drop.subscribe((value) => {
      console.log("6.2.1.1 ", `drop: ${value}`);
      console.log("6.2.1.2 ", `drop: ${value[0]}`);
      console.log("6.2.1.3 ", `drop: ${value.slice(1)}`);

      if(value[0]=="foo-list_9"){
        console.log("6.2.2.1 ", `drop: ${value[1]}`);//LI List item
        console.log("6.2.2.2 ", `drop: ${value[1].dataset.id}`);
        console.log("6.2.2.3 ", `drop: ${value[2]}`);//UL list parent
        console.log("6.2.2.4 ", `drop: ${value[3]}`);//UL list parent
        console.log("6.2.2.5 ", `drop: ${value[4]}`);//LI List item
        console.log("6.2.2.6 ", `drop: ${value[4].dataset.id}`);//LI List item

        // Custom code here
        this.onDrop(value.slice(1));
      }
      else{
        console.log("6.2.3 ", `drop: ${value[0]}`);
      }
    });

    dragulaService.over.subscribe((value) => {
      console.log("6.3.1 ", `over: ${value[0]}`);

      if(value[0]=="foo-list_9"){
        console.log("6.3.2 ", `over: ${value[0]}`);
        this.onOver(value.slice(1));
      }
      else{
        console.log("6.3.3 ", `over: ${value[0]}`);
      }
    });

    dragulaService.out.subscribe((value) => {
      console.log("6.4.1 ", `out: ${value[0]}`);

      if(value[0]=="foo-list_9"){
        console.log("6.4.2 ", `out: ${value[0]}`);
        this.onOut(value.slice(1));
      }
      else{
        console.log("6.4.3 ", `out: ${value[0]}`);
      }
    });

    //ex.10/11:
    dragulaService.setOptions('arriving_harbour_1', {
      invalid: (el, handle) => el.classList.contains('item_ship_doNotDrag')
    });


  }

  ngOnInit() {
  }

  //ex.6 / 9
  private onDrag(args) {
    let [e, el] = args;
    // do something
    console.log("6.1.4.1 ", `onDrag: ${e}`);
    console.log("6.1.4.2 ", `onDrag: ${el}`);

  }

  private onDrop(args) {
    let [e, el] = args;
    // do something
    console.log("6.2.4.1 ", `onDrop: ${e}`);
    console.log("6.2.4.2 ", `onDrop: ${el}`);

  }

  private onOver(args) {
    let [e, el, container] = args;
    // do something
    console.log("6.3.4.1 ", `onOver: ${e}}`);
    console.log("6.3.4.2 ", `onOver: ${el}`);
  }

  private onOut(args) {
    let [e, el, container] = args;
    // do something
    console.log("6.4.4.1 ", `onOut: ${e}`);
    console.log("6.4.4.2 ", `onOut: ${el}`);
  }

  //ex.9
  getList(): any[] {
    //console.log("9.1.1: ")
    return this.list;
  }











}





