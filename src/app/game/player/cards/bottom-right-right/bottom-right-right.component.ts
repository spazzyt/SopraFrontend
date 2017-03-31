import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bottom-right-right',
  templateUrl: './bottom-right-right.component.html',
  styleUrls: ['./bottom-right-right.component.css']
})
export class BottomRightRightComponent implements OnInit {

  constructor() { }

  ngOnInit() {

    //styles in styles.css at the end under popover, to style:
    //.popover .popover-title .popover-content .arrow

    (<any>$('#brr')).popover({
      placement: 'top',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      delay: {show: 500, hide: 500},
      html: true,
      content : '<img height="50%" width="100%" src="../../../../../assets/images/cards/lever.png"/>'
    });



    //(<any>$('#card')).css('color','#ffc520'); change the color of a link

  }

}
