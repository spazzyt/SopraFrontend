import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

import {LoginComponent} from "../login/login.component";
import {User} from "../shared/models/user";
import {Game} from "../shared/models/game";


@Component({
  selector: 'app-lobby',
  templateUrl: 'lobby.component.html',
  styleUrls: ['lobby.component.css']
})

export class LobbyComponent implements OnInit {

  user: User[]=[];
  game: Game[]=[];

  constructor(private router:Router) { }

  ngOnInit() {
  }

  navigateToGame(){
  this.router.navigate(['/game']);
  }

}
