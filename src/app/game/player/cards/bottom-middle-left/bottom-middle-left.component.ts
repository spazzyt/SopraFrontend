import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bottom-middle-left',
  templateUrl: './bottom-middle-left.component.html',
  styleUrls: ['./bottom-middle-left.component.css']
})
export class BottomMiddleLeftComponent implements OnInit {

  constructor() { }

  ngOnInit() {

    //styles in styles.css at the end under popover, to style:
    //.popover .popover-title .popover-content .arrow

    (<any>$('#bml')).popover({
      placement: 'top',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      show: 5500,
      hide: 5500,
      html: true,
      content : '<img height="50%" width="100%" src="../../../../../assets/images/cards/hammer.png"/>'
    });



    //(<any>$('#card')).css('color','#ffc520'); change the color of a link

  }

}
