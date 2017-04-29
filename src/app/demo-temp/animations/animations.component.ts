import {Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';


@Component({
  selector: 'app-animations',
  templateUrl: './animations.component.html',
  styleUrls: ['./animations.component.css']
})
export class AnimationsComponent implements OnInit, AfterViewInit {

  /*myFile="/src/app/demo-temp/animations/Bakermat - Living (Audio) ft. Alex Clare.mp3";*/
  myFile:any;

  constructor(){}

  ngOnInit() { this.localFileAudioPlayer()}

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

  //file picker
  localFileAudioPlayer() {
    let URL = window.URL;
    let playSelectedFile = function (event) {
      let file = this.files[0];
      let audioNode = document.querySelector('audio');

      let fileURL = URL.createObjectURL(file);
      if(0){console.log("2.0",fileURL);}
      audioNode.src = fileURL;
      if(0){console.log("2.1",audioNode);}
    };
    let inputNode = document.querySelector('input');
    inputNode.addEventListener('change', playSelectedFile, false);

      if(0){console.log("2.2",inputNode);}
  }


}
