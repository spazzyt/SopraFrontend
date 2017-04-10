import {Component, ViewChild} from '@angular/core';
import {Position, PositionEnum} from "./shared/models/position.enum";
import {Colour, ColourEnum} from "./shared/models/colour.enum";



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  //===============
  //Class Variables
  //===============
  title = 'Sopra FS17';

  position : typeof Position = Position;
  colour : typeof Colour = Colour;


  //===========================================
  // Enable Communication with Child Components
  //===========================================



  //================
  // ngAfterViewInit
  //================

  ngAfterViewInit() {



  }

}
