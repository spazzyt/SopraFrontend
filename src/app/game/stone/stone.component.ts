import {Component, OnInit, Input} from '@angular/core';
import {Stone} from "../../shared/models/stone";

@Component({
  selector: 'app-stone',
  templateUrl: './stone.component.html',
  styleUrls: ['./stone.component.css']
})
export class StoneComponent implements OnInit {

  //===============
  //Class Variables
  //===============
  //input from parent: site
  @Input() stone:Stone;
  //stone:Stone;

  //===============
  //Constructor
  //===============
  constructor() {
  }

  //===============
  //ngOnInit
  //===============
  ngOnInit() {
  }

}
