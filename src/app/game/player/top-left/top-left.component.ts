import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-top-left',
  templateUrl: './top-left.component.html',
  styleUrls: ['./top-left.component.css']
})

//===========
// Component
//===========
export class TopLeftComponent implements OnInit {


  //===============
  //Class Variables
  //===============




  //===============
  //Constructor
  //===============

  constructor() {

  }


  //==========
  // ngOnInit
  //==========

  ngOnInit() {

    this.initializePopovers();

  }

  //===============
  // Other-Methods
  //===============




  //================
  // Popover-Methods
  //================

  initializePopovers(){

    //From bottom-left-left
    (<any>$('#bll_2')).popover({
      placement: 'bottom',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 500, hide: 500}, //delay-test for popover hover
      html: true,
      content : '<img height="50%" width="100%" src="../../../../assets/images/cards/chisel.png"/>'
    });


    //From bottom-middle-left
    (<any>$('#bml_2')).popover({
      placement: 'bottom',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 500, hide: 500}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px" src="../../../../assets/images/cards/hammer.png"/>'
    });


    //From bottom-middle-right
    (<any>$('#bmr_2')).popover({
      placement: 'bottom',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 500, hide: 500}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px" src="../../../../assets/images/cards/sail.png"/>'
    });

    //From bottom-right-right
    (<any>$('#brr_2')).popover({
      placement: 'bottom',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 500, hide: 500}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px"" src="../../../../assets/images/cards/lever.png"/>'
    });

    //From purple-card
    (<any>$('#purple_2')).popover({
      placement: 'bottom',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 500, hide: 500}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px" src="../../../../assets/images/cards/statues.png"/>'
    });

    //From top-left-left
    (<any>$('#tll_2')).popover({
      placement: 'bottom',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 500, hide: 500}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px" src="../../../../assets/images/cards/pyramiddec.png"/>'
    });

    //From top-middle-left
    (<any>$('#tml_2')).popover({
      placement: 'bottom',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 500, hide: 500}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px" src="../../../../assets/images/cards/templedec.png"/>'
    });

    //From top-middle-right
    (<any>$('#tmr_2')).popover({
      placement: 'bottom',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 500, hide: 500}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px" src="../../../../assets/images/cards/burialdec.png"/>'
    });

    //From top-right-right
    (<any>$('#trr_2')).popover({
      placement: 'bottom',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 500, hide: 500}, //delay-test for popover hover
      html: true,
      content : '<img height="150px" width="250px" src="../../../../assets/images/cards/obeliskdec.png"/>'
    });


  }

}
