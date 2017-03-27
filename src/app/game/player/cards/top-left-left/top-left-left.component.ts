import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-top-left-left',
  templateUrl: './top-left-left.component.html',
  styleUrls: ['./top-left-left.component.css']
})
export class TopLeftLeftComponent implements OnInit {

  constructor() { }

  ngOnInit() {

    //styles in styles.css at the end under popover, to style:
    //.popover .popover-title .popover-content .arrow

    //hover from top doesn't work properly
    (<any>$('#tll')).popover({
      placement: 'top',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      show: 5500,
      hide: 5500,
      html: true,
      content : '<img height="50%" width="100%" src="../../../../../assets/images/cards/pyramiddec.png"/>'
    });



    //(<any>$('#card')).css('color','#ffc520'); change the color of a link




  }

}
