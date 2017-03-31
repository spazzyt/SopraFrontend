import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-purple-card',
  templateUrl: './purple-card.component.html',
  styleUrls: ['./purple-card.component.css']
})
export class PurpleCardComponent implements OnInit {

  constructor() { }

  ngOnInit() {

    //styles in styles.css at the end under popover, to style:
    //.popover .popover-title .popover-content .arrow

    (<any>$('#purple')).popover({
      placement: 'top',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 500, hide: 500},
      html: true,
      content : '<img height="50%" width="100%" src="../../../../../assets/images/cards/statues.png"/>'
    });



    //(<any>$('#card')).css('color','#ffc520'); change the color of a link


  }

}
