import {Component, ViewChild} from '@angular/core';
import {LobbyComponent} from "./lobby/lobby.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Sopra FS17';

  //===========================================
  // Enable Communication with Child Components
  //===========================================

  // Enable communication with MarketComponent
  @ViewChild(LobbyComponent) lobbyComponent:LobbyComponent;

  //================
  // ngAfterViewInit
  //================

  ngAfterViewInit() {

  }

}
