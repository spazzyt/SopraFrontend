import {Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';


@Component({
  selector: 'app-animations',
  templateUrl: './animations.component.html',
  styleUrls: ['./animations.component.css']
})
export class AnimationsComponent implements OnInit, AfterViewInit {

  myfile="/src/app/demo-temp/animations/Bakermat - Living (Audio) ft. Alex Clare.mp3"

  constructor(){}

  ngOnInit() {}

  //sound effect after init
  ngAfterViewInit() {
    let audio = new Audio();
    audio.src = "src/app/demo-temp/animations/Dinner_Bell_Triangle.mp3";
    audio.play();
  }

  //sound effect on click on div element
  soundEffect_1(){
    let audio = new Audio();
    audio.src = "/src/app/demo-temp/animations/Water_Lapping_Wind.mp3";
    audio.play();
  }

}
