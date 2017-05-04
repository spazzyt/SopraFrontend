import {Component, OnInit, Input} from '@angular/core';
import {Router} from "@angular/router";
import {Game} from "../../shared/models/game";
import {LobbyService} from "../../shared/services/lobby.service";
import {Ship} from "../../shared/models/ship";
import {Stone} from "../../shared/models/stone";
import {isNullOrUndefined} from "util";
import {GameService} from "../../shared/services/game.service";
import {Move} from "../../shared/models/move";
import {PositionEnum} from "../../shared/models/position.enum";
import {ColourEnum} from "../../shared/models/colour.enum";

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

  //set from gameService, it tells the modal to which site the ship has sailed (so we can send the correct move)
  leverDestination: PositionEnum;

  //ID of the lever card that was played; TODO set from other component
  leverId: number;

  //=============
  // Constructor
  //=============
  constructor(private router:Router,
              private lobbyService:LobbyService,
              private gameService:GameService
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
        //TODO display a message like "you haven't chosen all stones yet"
        return; //if one of the stones in the "choose" array is not null, the player hasn't finished yet
      }
    }

    //close the modal by clicking hidden button (that workaround though)
    document.getElementById('hidden_btn').click();

    //tell the game that lever modal was closed
    //the leverModalOpen boolean is used locally to determine whether we need to send putting a stone on the ship as a move
    //IMPORTANT: This MUST be set before sending move to backend, else it won't send (checks in sendMove for open levermodal)
    this.game.leverModalOpen = false;
    this.game.leverPlayed = false;

    //Generate & send first move: new card order
    let cardId = this.leverId;
    console.log("SHIP ID SENT TO BACKEND: ", this.leverShip);
    let shipId = this.leverShip;

    //construct stone array in backend approved format:
    // 0 = empty, 1 = black, 2 = white, 3 = brown, 4 = gray

    let stoneArray: number[] = [];

    for(let i = 0; i < this.ships[shipId].slots.length; i++){
      if(this.ships[shipId].slots[i] == null){
        stoneArray.push(0);
      }
      else if(this.ships[shipId].slots[i].colour == ColourEnum.black){
        stoneArray.push(1);
      }
      else if(this.ships[shipId].slots[i].colour == ColourEnum.white){
        stoneArray.push(2);
      }
      else if(this.ships[shipId].slots[i].colour == ColourEnum.brown){
        stoneArray.push(3);
      }
      else if(this.ships[shipId].slots[i].colour == ColourEnum.gray){
        stoneArray.push(4);
      }
    }

    let leverMove = new Move(PositionEnum.PlayerCardStack, PositionEnum.Market, cardId, shipId, stoneArray);

    //Send to backend
    this.gameService.sendMove(leverMove).subscribe( resp => {

      console.log("SENT FIRST MOVE: ", leverMove);

      //Generate & send second move: ship to site
      let destination = this.leverDestination;
      console.log("LEVER DESTINATION: ", this.leverDestination);

      let leverMove2 = new Move(PositionEnum.DepartingHarbour, destination, this.leverShip)

      //Send to backend
      this.gameService.sendMove(leverMove2);

      console.log("SENT SECOND MOVE: ", leverMove2);

      console.log("LEVER FINISHED, NEW STATUS: " + this.game.leverPlayed)

      }
    );



  }


}
