import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-top-right-right',
  templateUrl: './top-right-right.component.html',
  styleUrls: ['./top-right-right.component.css']
})
export class TopRightRightComponent implements OnInit {

  constructor() { }

  ngOnInit() {

    //styles in styles.css at the end under popover, to style:
    //.popover .popover-title .popover-content .arrow

    (<any>$('#trr')).popover({
      placement: 'top',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      show: 5500,
      hide: 5500,
      html: true,
      content : '<img height="50%" width="100%" src="../../../../../assets/images/cards/obeliskdec.png"/>'
    });



    //(<any>$('#card')).css('color','#ffc520'); change the color of a link

  }

}
