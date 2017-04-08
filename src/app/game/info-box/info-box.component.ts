import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-info-box',
  templateUrl: './info-box.component.html',
  styleUrls: ['./info-box.component.css']
})

//===========
// Component
//===========
export class InfoBoxComponent implements OnInit {

  //============
  // Attributes
  //============
  roundNumber:number=1;

  //=============
  // Constructor
  //=============
  constructor(private router:Router) { }


  //==========
  // ngOnInit
  //==========
  ngOnInit() {
  }

  //===============
  // Other-Methods
  //===============
  navigateToLobby(){
    this.router.navigate(['/game']);
  }

  increaseRoundInInfoBox(roundNumber_:number){

    this.roundNumber=roundNumber_;

  }

}
