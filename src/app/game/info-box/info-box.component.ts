import {Component, OnInit, Input} from '@angular/core';
import {Router} from "@angular/router";
import {Game} from "../../shared/models/game";
import {LobbyService} from "../../shared/services/lobby.service";

@Component({
  selector: 'app-info-box',
  templateUrl: './info-box.component.html',
  styleUrls: ['./info-box.component.css']
})

//===========
// Component
//===========
export class InfoBoxComponent implements OnInit {

  @Input()
  game: Game;

  //============
  // Attributes
  //============
  roundNumber:number=1;

  //=============
  // Constructor
  //=============
  constructor(private router:Router,
              private lobbyService:LobbyService
  ) { }


  //==========
  // ngOnInit
  //==========
  ngOnInit() {
  }

  //===============
  // Other-Methods
  //===============
  navigateToLobby(){
    this.router.navigate(['/game']);
  }

  increaseRoundInInfoBox(roundNumber_:number){

    this.roundNumber=roundNumber_;

  }

  leaveGame(){
    this.lobbyService.leaveGameService(this.game.id).subscribe(game => {

      this.router.navigate(['/lobby']);
    });


  }

}
