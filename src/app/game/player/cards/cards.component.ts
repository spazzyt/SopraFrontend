import { Component, OnInit } from '@angular/core';
import { TopLeftLeftComponent } from './top-left-left/top-left-left.component';
import { TopMiddleLeftComponent } from './top-middle-left/top-middle-left.component';
import { TopMiddleRightComponent } from './top-middle-right/top-middle-right.component';
import { TopRightRightComponent } from './top-right-right/top-right-right.component';
import { BottomLeftLeftComponent } from './bottom-left-left/bottom-left-left.component';
import { BottomMiddleLeftComponent } from './bottom-middle-left/bottom-middle-left.component';
import { BottomMiddleRightComponent } from './bottom-middle-right/bottom-middle-right.component';
import { BottomRightRightComponent } from './bottom-right-right/bottom-right-right.component';
import { PurpleCardComponent } from './purple-card/purple-card.component';




@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css']
})
export class CardsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
