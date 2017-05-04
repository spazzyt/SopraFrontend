import {Component, OnInit, Input} from '@angular/core';
import {Router} from "@angular/router";
import {Game} from "../../shared/models/game";
import {LobbyService} from "../../shared/services/lobby.service";
import {Ship} from "../../shared/models/ship";
import {Stone} from "../../shared/models/stone";
import {isNullOrUndefined} from "util";

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

  @Input()
  leverShip: number;

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
    console.log("SAVED STONES FOR LEVER: ", this.leverStones)
    document.getElementById('lever_btn').click();
  }

  sendLeverOrder(){
    //check if all stones have been taken
    console.log("LEVERSTONES: ", this.leverStones)

    for(let i = 0; i < this.leverStones.length; i++){
      if(!isNullOrUndefined(this.leverStones[i])){
        return; //if one of the stones in the "choose" array is not null, the player hasn't finished yet
      }
    }

    //close the modal by clicking hidden button (that workaround though)
    document.getElementById('hidden_btn').click();

    //tell the game that lever modal was closed
    //the leverModalOpen boolean is used locally to determine whether we need to send putting a stone on the ship as a move
    this.game.leverModalOpen = false;
    this.game.leverPlayed = false; //TODO check this
    console.log("LEVER STATUS: " + this.game.leverPlayed)

    //TODO tell game to continue, send move?? --> check with backend
  }


}
