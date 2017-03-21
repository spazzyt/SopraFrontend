import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-info-box',
  templateUrl: './info-box.component.html',
  styleUrls: ['./info-box.component.css']
})
export class InfoBoxComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {
  }

  navigateToLobby(){
    this.router.navigate(['/game']);
  }

}
