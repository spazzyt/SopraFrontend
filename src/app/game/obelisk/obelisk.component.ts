import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-obelisk',
  templateUrl: './obelisk.component.html',
  styleUrls: ['./obelisk.component.css']
})
export class ObeliskComponent implements OnInit {




  stones:number[] = [0,0,0,0];

  constructor() {}

  ngOnInit() {
    //styles in styles.css at the end under popover, to style:
    //.popover .popover-title .popover-content .arrow

    //hover from top doesn't work properly
    (<any>$('#obelisk')).popover({
      placement: 'top',
      trigger : 'hover',
      toggle: 'popover',
      title: '',
      show: 5500,
      hide: 5500,
      html: true,
      content : 'Assess points at the end of the game'
    });


  }

  increaseStones(targetStones: number[]){
    for (let i of [0,1,2,3]) {
      this.stones[i] += targetStones[i];
    }
  }

}
