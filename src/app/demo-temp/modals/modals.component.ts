import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-modals',
  templateUrl: './modals.component.html',
  styleUrls: ['./modals.component.css']
})
export class ModalsComponent implements OnInit {

  constructor() { }

  ngOnInit() {

    (<any>$(document)).ready(function(){
      (<any>$("#myBtn")).click(function(){
        (<any>$("#myModal")).modal();
      });
    });

  }

}
