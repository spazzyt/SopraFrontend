import { Component, OnInit } from '@angular/core';
import { ScoreComponent } from '../score/score.component'
import { SupplySledComponent } from '../supply-sled/supply-sled.component';
import { QuarryComponent } from '../quarry/quarry.component';

@Component({
  selector: 'app-bottom-left',
  templateUrl: './bottom-left.component.html',
  styleUrls: ['./bottom-left.component.css']
})
export class BottomLeftComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
