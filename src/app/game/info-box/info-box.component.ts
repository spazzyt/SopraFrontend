import {Component, OnInit, Input} from '@angular/core';
import {Router} from "@angular/router";
import {Game} from "../../shared/models/game";
import {LobbyService} from "../../shared/services/lobby.service";
import {Ship} from "../../shared/models/ship";
import {Stone} from "../../shared/models/stone";

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

  @Input()
  ships: Ship[];

  //============
  // Attributes
  //============
  roundNumber:number=1;
  leverStones: Stone[];

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

  //Called from gameComponent using this.infoboxcomponent.showlevermodal()
  showLeverModal(stones: Stone[]){

    this.leverStones = stones;

    document.getElementById('lever_btn').click();
  }

  sendLeverOrder(){
    //tell the game that lever modal was closed
    //the leverModalOpen boolean is used locally to determine whether we need to send putting a stone on the ship as a move
    this.game.leverModalOpen = false;

    //TODO tell game to continue, send move??
  }

}
