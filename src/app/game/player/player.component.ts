import { Component, OnInit } from '@angular/core';
import { BottomLeftComponent } from './bottom-left/bottom-left.component';
import { BottomRightComponent } from './bottom-right/bottom-right.component';
import { TopLeftComponent } from './top-left/top-left.component';
import { TopRightComponent } from './top-right/top-right.component';
import { ScoreComponent } from './score/score.component';
import { SupplySledComponent } from './supply-sled/supply-sled.component';
import { QuarryComponent } from './quarry/quarry.component';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
