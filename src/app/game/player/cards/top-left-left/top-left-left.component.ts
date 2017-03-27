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


    (<any>$('#test')).popover({
      placement: 'top',
      trigger : 'hover',
      toggle: 'popover',
      title: 'Title Whatever you Need',
      show: 5500,
      hide: 5500,
      html: true,
      content : '<div><b>Very</b> <span style="color: #C21F">Dynamic</span> ' +
      '<span style="color: #00b3ee">Reusable</span>' +
      '<b><i><span style="color: #ffc520">Tooltip With</span></i></b> ' +
      '<small>Html support</small>.' +
      '<img src="../../../../../assets/images/cards/pyramiddec.png"/></div>'
    });



    (<any>$('#test')).css('color','#ffc520');




  }

}
