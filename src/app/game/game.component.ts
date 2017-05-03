import {Component, OnInit, ViewChild, NgZone} from '@angular/core';
import {DragulaService} from "ng2-dragula";
import {GameService} from "../shared/services/game.service";
import {MarketComponent} from "./market/market.component";
import {DepartingHarbourComponent} from "./departing-harbour/departing-harbour.component";
import {BottomLeftComponent} from "./player/bottom-left/bottom-left.component";
import {TempleComponent} from "./temple/temple.component";
import {PyramidComponent} from "./pyramid/pyramid.component";
import {ObeliskComponent} from "./obelisk/obelisk.component";
import {BurialChamberComponent} from "./burial-chamber/burial-chamber.component";
import {BottomRightComponent} from "./player/bottom-right/bottom-right.component";
import {TopRightComponent} from "./player/top-right/top-right.component";
import {TopLeftComponent} from "./player/top-left/top-left.component";
import {User} from "../shared/models/user";
import {Ship} from "../shared/models/ship";
import {Stone} from "../shared/models/stone";
import {StoneQuarry} from "../shared/models/stone-quarry";
import {SupplySled} from "../shared/models/supply-sled";
import {Pyramid} from "../shared/models/pyramid";
import {Obelisk} from "../shared/models/obelisk";
import {BurialChamber} from "../shared/models/burial-chamber";
import {Market} from "../shared/models/market";
import {Temple} from "../shared/models/temple";
import {ColourEnum} from "../shared/models/colour.enum";
import {InfoBoxComponent} from "./info-box/info-box.component";
import {Game} from "../shared/models/game";
import {MarketCard} from "../shared/models/market-card";
import {UserService} from "../shared/services/user.service";
import {ActivatedRoute} from "@angular/router";
import {Round} from "../shared/models/round";
import {GameStatusEnum} from "../shared/models/game-status.enum";
import {PositionEnum} from "../shared/models/position.enum";
import {Move} from "../shared/models/move";
import {WSService} from "../shared/services/websocket.service";
import {UserNameAndScore} from "../shared/models/user-name-and-score";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})

//===========
// Component
//===========
export class GameComponent  implements OnInit {

  //===============
  //Class Variables
  //===============

  public myComp;

  // initial Game object received from Backend
  game: Game;

  //player names for scoreboard
  playerNames: string[] = [];

  //player scores for scoreboard
  playerScores: number[] = [7,4,2,8];

  //array for mapping names to scores
  nameAndScores: UserNameAndScore[] = [];

  // my username entered in login screen
  // get username from userService
  myUserName:string=this.userService.mySelf().username;

  // my player field
  myPlayerField:ColourEnum;

  // player field of current active player
  private playerMap: Map<any, any>;
  private colourMap: Map<any, any>;
  private nameToColourMap: Map<any, any>;
  private siteMap: Map<any, any>;
  private siteToStringMap: Map<any, any>;

  // store ships via their id
  ships:Map<number,Ship> = new Map();

  // access map for all sites
  sites:Map<string,any> = new Map();

  //===========================================
  // Enable Communication with Child Components
  //===========================================

  // Enable communication with active player component BottomLeftComponent
  @ViewChild(BottomLeftComponent) bottomLeftComponent:BottomLeftComponent;

  // Enable communication with not active player component BottomLeftComponent
  @ViewChild(TopLeftComponent) topLeftComponent:TopLeftComponent;

  // Enable communication with not active player component BottomLeftComponent
  @ViewChild(TopRightComponent) topRightComponent:TopRightComponent;

  // Enable communication with not active player component BottomLeftComponent
  @ViewChild(BottomRightComponent) bottomRightComponent:BottomRightComponent;

  // Enable communication with InfoBoxComponent
  @ViewChild(InfoBoxComponent) infoBoxComponent:InfoBoxComponent;

  // Enable communication with DepartingHarbour
  @ViewChild(DepartingHarbourComponent) departingHarbourComponent:DepartingHarbourComponent;

  // Enable communication with PyramidComponent
  @ViewChild(PyramidComponent) pyramidComponent:PyramidComponent;

  // Enable communication with TempleComponent
  @ViewChild(TempleComponent) templeComponent:TempleComponent;

  // Enable communication with BurialChamberComponent
  @ViewChild(BurialChamberComponent) burialChamberComponent:BurialChamberComponent;

  // Enable communication with ObeliskComponent
  @ViewChild(ObeliskComponent) obeliskComponent:ObeliskComponent;

  // Enable communication with MarketComponent
  @ViewChild(MarketComponent) marketComponent:MarketComponent;


  //===============
  //Constructor
  //===============
  constructor(private gameService: GameService,
              private wsService: WSService,
              private userService: UserService,
              private route: ActivatedRoute) {
    this.myComp = this;
  }

  //==========
  // ngOnInit
  //==========

  ngOnInit() {

    this.sites["Pyramid"] = this.pyramidComponent;
    this.sites["Temple"] = this.templeComponent;
    this.sites["BurialChamber"] = this.burialChamberComponent;
    this.sites["Obelisk"] = this.obeliskComponent;
    this.sites["Market"] = this.marketComponent;


    // (+) converts string 'id' to a number
    let id = +this.route.snapshot.params['id'];

    if(!isNaN(id)) {

      this.gameService.getGame(id)
        .subscribe((game: Game) => {
          this.game = game;


          //Map player names to components
          this.playerMap = new Map();

          this.playerMap[this.game.players[0].username] = this.bottomLeftComponent;
          this.playerMap[this.game.players[1].username] = this.topLeftComponent;
          if(this.game.numPlayers > 2) this.playerMap[this.game.players[2].username] = this.topRightComponent;
          if(this.game.numPlayers > 3) this.playerMap[this.game.players[3].username] = this.bottomRightComponent;

          //Map player colours to components
          this.colourMap = new Map();

          this.colourMap[ColourEnum.black] = this.bottomLeftComponent;
          this.colourMap[ColourEnum.white] = this.topLeftComponent;
          if(this.game.numPlayers > 2) this.colourMap[ColourEnum.brown] = this.topRightComponent;
          if(this.game.numPlayers > 3) this.colourMap[ColourEnum.gray] = this.bottomRightComponent;

          //Map player names to colours
          this.nameToColourMap = new Map();

          this.nameToColourMap[this.game.players[0].username] = ColourEnum.black;
          this.nameToColourMap[this.game.players[1].username] = ColourEnum.white;
          if(this.game.numPlayers > 2) this.nameToColourMap[this.game.players[2].username] = ColourEnum.brown;
          if(this.game.numPlayers > 3) this.nameToColourMap[this.game.players[3].username] = ColourEnum.gray;

          this.siteMap = new Map();

          this.siteMap['Pyramid'] = this.pyramidComponent;
          this.siteMap['Temple'] = this.templeComponent;
          this.siteMap['BurialChamber'] = this.burialChamberComponent;
          this.siteMap['Obelisk'] = this.obeliskComponent;

          this.siteToStringMap = new Map();

          this.siteToStringMap[PositionEnum.Pyramid] = 'Pyramid';
          this.siteToStringMap[PositionEnum.Temple] = 'Temple';
          this.siteToStringMap[PositionEnum.BurialChamber] = 'BurialChamber';
          this.siteToStringMap[PositionEnum.Obelisk] = 'Obelisk';

          //Initialize the new game
          this.initializeNewGame(this.game);

          console.log("Initializing game with id: ", id, game);

          // Now we need to connect via websockets and listen for gamestate updates
          this.wsService.connectToGame(id, this);
        });
    }

    //snackbar div in game footer (has to be in ngOnInit, not in Constructor)
    this.generateSnackbarDiv();

  }

  moveShipById(shipId:number, targetSite:string) {
    let ship:Ship = this.ships[shipId];
    ship.isInHarbour = false;
    this.sites[targetSite].setShip(ship);
    console.log("movedShip ", shipId, targetSite, ship, this.sites[targetSite]);
  }

  //===========================================================
  // Initialize the new game:
  // All components, mySelf (either active or inactive player)
  //===========================================================

  initializeNewGame(game_backend:Game){

    this.gameService.initializePopovers();

    //set class variable
    let game = new Game(game_backend.id, game_backend.token, game_backend.name, game_backend.status, game_backend.numPlayers, game_backend.players, game_backend.roundNumber, game_backend.ships, game_backend.marketCards, game_backend.currentActivePlayerField);
    this.game = game;

    //set username in game model
    this.game.myUserName = this.myUserName;

    //pass game information to gameService
    this.gameService.setGame(this.game);

    //fill ship array with nulls
    this.game.ships = [null, null, null, null];

    //Site Board Components: the island
    this.initializeObeliskComponent();
    this.initializePyramidComponent();
    this.initializeTempleComponent();
    this.initializeBurialChamberComponent();

    //Player Component: the four player fields (what everyone concerns)
    this.initializePlayerComponents(this.game.players, this.game.numPlayers);

    //Determine which player field you have (sets class variable)
    this.game.myPlayerField=this.determineWhichPlayerFieldYouHave(
      game_backend.players,
      game_backend.numPlayers);

    //Fill the local player array (used for the scoreboard)
    for(let i = 0; i < this.game.players.length; i++){
      this.playerNames[i] = this.game.players[i].username;
    }

    this.setActivePlayerfield(this.game.currentActivePlayerField);

  }

  // Init Sites
  //-----------

  initializeObeliskComponent(){
    this.obeliskComponent.setAttributes(this.game.numPlayers);
    this.obeliskComponent.removeStones();
  }

  initializePyramidComponent(){
    this.pyramidComponent.removeStones();
  }

  initializeTempleComponent(){
    this.templeComponent.setAttributes(this.game.numPlayers);
    this.templeComponent.removeStones();
  }

  initializeBurialChamberComponent(){
    this.burialChamberComponent.removeStones();
  }

  // Init Player Components (what everyone concerns)
  //------------------------------------------------
  initializePlayerComponents(players_:User[], numPlayers_:number) {

    for (let i = 0; i < numPlayers_; i++) {

      //bottomLeftComponent
      //-------------------
      if(i==0){
        if(0){console.log("initialize BottomLeftComponent");}

        // set score to zero
        this.bottomLeftComponent.setScore(0);

        //instantiate Quarry objects, internally instantiate 27 stones Objects
        let stoneQuarry1 = new StoneQuarry(27, 3, ColourEnum.black, players_[i]);

        //instantiate Sled objects, internally instantiate 2 stones Objects
        let supplySled1 = new SupplySled(2, 1, ColourEnum.black, players_[i]);

        // initialize stone quarry object in Player 1 Component
        this.bottomLeftComponent.stoneQuarry=stoneQuarry1;

        // initialize supply sled object in Player 1 Component
        this.bottomLeftComponent.supplySled=supplySled1;

        // set the attribute number shown in PlayerField
        this.bottomLeftComponent.setStonesInQuarry(stoneQuarry1.stones.length);

        // set the attribute number shown in PlayerField
        this.bottomLeftComponent.setStonesInSled(supplySled1.stones.length);

        // set playerName shown in PlayerField
        this.bottomLeftComponent.setPlayerName(players_[i].username);

      }

      //topLeftComponent
      //----------------
      else if(i==1){
        if(0){console.log("initialize TopLeftComponent");}

        // set score to zero
        this.topLeftComponent.setScore(0);

        //instantiate Quarry objects, internally instantiate 26 stones Objects
        let stoneQuarry2 = new StoneQuarry(26, 34, ColourEnum.white, players_[i]);

        //instantiate Sled objects, internally instantiate 3 stones Objects
        let supplySled2 = new SupplySled(3, 31, ColourEnum.white, players_[i]);

        // initialize stone quarry object in Player 2 Component
        this.topLeftComponent.stoneQuarry=stoneQuarry2;

        // initialize supply sled object in Player 2 Component
        this.topLeftComponent.supplySled=supplySled2;

        // set the attribute number shown in PlayerField
        this.topLeftComponent.setStonesInQuarry(stoneQuarry2.stones.length);

        // set the attribute number shown in PlayerField
        this.topLeftComponent.setStonesInSled(supplySled2.stones.length);

        // set playerName shown in PlayerField
        this.topLeftComponent.setPlayerName(players_[i].username);

      }

      //topRightComponent
      //-----------------
      else if(i==2){
        if(0){console.log("initialize TopRightComponent");}

        // set score to zero
        this.topRightComponent.setScore(0);

        //instantiate Quarry objects, internally instantiate 25 stones Objects
        let stoneQuarry3 = new StoneQuarry(25, 65, ColourEnum.brown, players_[i]);

        //instantiate Sled objects, internally instantiate 4 stones Objects
        let supplySled3 = new SupplySled(4, 61, ColourEnum.brown, players_[i]);

        // initialize stone quarry object in Player 3 Component
        this.topRightComponent.stoneQuarry=stoneQuarry3;

        // initialize supply sled object in Player 3 Component
        this.topRightComponent.supplySled=supplySled3;

        // set the attribute number shown in PlayerField
        this.topRightComponent.setStonesInQuarry(stoneQuarry3.stones.length);

        // set the attribute number shown in PlayerField
        this.topRightComponent.setStonesInSled(supplySled3.stones.length);

        // set playerName shown in PlayerField
        this.topRightComponent.setPlayerName(players_[i].username);

      }

      //bottomRightComponent
      //--------------------
      else if(i==3){
        if(0){console.log("initialize BottomRightComponent");}

        // set score to zero
        this.bottomRightComponent.setScore(0);

        //instantiate Quarry objects, internally instantiate 24 stones Objects
        let stoneQuarry4 = new StoneQuarry(24, 96, ColourEnum.gray, players_[i]);

        // instantiate Sled objects, internally instantiate 5 stones Objects
        let supplySled4 = new SupplySled(5, 91, ColourEnum.gray, players_[i]);

        // initialize stone quarry object in Player 4 Component
        this.bottomRightComponent.stoneQuarry=stoneQuarry4;

        // initialize supply sled object in Player 4 Component
        this.bottomRightComponent.supplySled=supplySled4;

        // set the attribute number shown in PlayerField
        this.bottomRightComponent.setStonesInQuarry(stoneQuarry4.stones.length);

        // set the attribute number shown in PlayerField
        this.bottomRightComponent.setStonesInSled(supplySled4.stones.length);

        // set playerName shown in PlayerField
        this.bottomRightComponent.setPlayerName(players_[i].username);

      }
    }
  }

  //Determine which playerField you have
  //------------------------------------
  determineWhichPlayerFieldYouHave(players_:User[], numPlayers_:number):ColourEnum{
    let myPlayerField:ColourEnum;
    for (let i = 0; i < numPlayers_; i++) {
      if(i==0){
        if(players_[i].username===this.myUserName){
          this.myPlayerField=ColourEnum.black;
          myPlayerField=  ColourEnum.black;
        }
      }
      else if(i==1){
        if(players_[i].username===this.myUserName){
          this.myPlayerField=ColourEnum.white;
          return ColourEnum.white;
        }
      }
      else if(i==2){
        if(players_[i].username===this.myUserName){
          this.myPlayerField=ColourEnum.brown;
          myPlayerField=  ColourEnum.brown;
        }
      }
      else if(i==3){
        if(players_[i].username===this.myUserName){
          this.myPlayerField=ColourEnum.gray;
          myPlayerField= ColourEnum.gray;
        }
      }
      else{
        if(1){console.log("initializePlayerComponents: error");
          alert("initializePlayerComponents:error");}
      }
    }

    console.log("My player field was determined: ", myPlayerField);
    return myPlayerField;
  }

  initRound(round: Round){

    //only make stones draggable if player has stones
    this.updateStoneDragStatus();


    for(let ship of this.game.ships){
      ship = null;
    }

    //Update internal data arrays with data from backend:
    this.game.roundNumber = round.roundNumber;
    this.game.ships = round.ships;

    //remove ships from final destinations
    this.pyramidComponent.finalDestinationComponent.ship = null;
    this.templeComponent.finalDestinationComponent.ship = null;
    this.burialChamberComponent.finalDestinationComponent.ship = null;
    this.obeliskComponent.finalDestinationComponent.ship = null;
    this.marketComponent.finalDestinationComponent.ship = null;


    // init the ship map
    for(let ship of this.game.ships)
      this.ships[ship.id] = ship;

    this.game.marketCards = round.marketCards;

    //increase round in info box
    this.infoBoxComponent.increaseRoundInInfoBox(round.roundNumber);

    //set current score for each player
    for(let player of this.game.players){
      this.playerMap[player.username].setScore(round.berlinerScore[player.username]);
    }
  }

  //Updates score, sled & quarry values for everyone
  updateScoreSledQuarry(scores: Map<string, number>, sleds: Map<string, number>, quarries: Map<string, number>,){

    //set current score for player
    for(let player of this.game.players) {
      this.playerMap[player.username].setStonesInSled(scores[player.username]);
    }

    //set current sled stones for player
    for(let player of this.game.players) {
      this.playerMap[player.username].setStonesInSled(sleds[player.username]);
    }
    //set current quarry stones for player
    for(let player of this.game.players) {
      this.playerMap[player.username].setStonesInQuarry(quarries[player.username]);
    }
  }

  updateStoneDragStatus(){
    for(let player of this.game.players){
      //call function for each player
      this.playerMap[player.username].checkStonesDragable();
    }
  }


  updateCardPick(){
    //determine if this player can pick
    this.game.canIPick = this.game.whoCanPickCard == this.myUserName;

  }

  removeCardById(id: number){
    for(let i = 0; i < this.game.marketCards.length; i++){
      if(this.game.marketCards[i] != null && this.game.marketCards[i].id == id){
        this.game.marketCards[i] = null;
        return;
      }
    }
  }

  //===========================================================
  // Update Game UI for one Move of another client
  //===========================================================

  updateUiForOneMove(move: Move, username: string, berlinerScore: Map<string, number>, sleds: Map<string, number>, quarries: Map<string, number>, playerCards: Map<string, MarketCard[]>){

    //only set stones to draggable if player has stones
    this.updateStoneDragStatus();

    console.log('Updating UI for this move from other player: ', move, " by Player ", username);

    //SWITCH based on what move the backend sent us
    switch(move.to){

      //Take stones from quarry
      case PositionEnum.Sled:
        this.playerMap[username].update_takeStonesFromQuarry(move.pos);

        //show snackbar
        let numStones = move.pos //TODO check that backend number is at most 3
        this.showSnackbarMessage(username.substring(0,10) + ' took ' + numStones + ' stone(s) from the quarry.');

        //update score, sled & quarry
        this.updateScoreSledQuarry(berlinerScore, sleds, quarries);
        this.updatePlayerCards(playerCards);

        break;

      //Sail ship to site:
      case PositionEnum.Pyramid:
      case PositionEnum.Temple:
      case PositionEnum.BurialChamber:
      case PositionEnum.Obelisk:
        if(move.from == PositionEnum.Quarry){
          //if it's a move caused by a red card, don't move a ship
          let stoneToPlace: Stone[] = [new Stone(null, this.nameToColourMap[username])]
          this.siteMap[this.siteToStringMap[move.to]].placeStones(stoneToPlace);
          console.log("PLACED A"+ this.nameToColourMap[username] + " STONE ON " + this.siteToStringMap[move.to] + "WITH RED CARD.");
          //update score, sled & quarry
          this.updateScoreSledQuarry(berlinerScore, sleds, quarries);
          this.updatePlayerCards(playerCards);

          this.showSnackbarMessage(username.substring(0,10) + ' placed a stone to the ' + this.siteToStringMap[move.to] + ' with a red card.');

        }
        else{ //Move not caused by red card
          this.moveShipById(move.pos, this.siteToStringMap[move.to]);
          //place stones on site
          this.siteMap[this.siteToStringMap[move.to]].placeStones(this.game.ships[move.pos].slots);
          //remove stones from ship
          this.game.ships[move.pos].slots = [];


          //show snackbar
          let shipnr = move.pos+1;
          this.showSnackbarMessage(username.substring(0,10) + ' sailed ship ' + shipnr + ' to the ' + this.siteToStringMap[move.to] + '.');
        }
        break;


      //Sail ship to Market:
      case PositionEnum.Market:
        this.moveShipById(move.pos, 'Market');

        //remove stones from ship
        this.game.ships[move.pos].slots = [];

        break;

      //Place stone on ship:
      case PositionEnum.DepartingHarbour:
        let stoneToAdd = new Stone(-1, this.nameToColourMap[username]);
        this.ships[move.ShipID].addStoneById(stoneToAdd, move.pos);

        //update score, sled & quarry
        this.updateScoreSledQuarry(berlinerScore, sleds, quarries);
        this.updatePlayerCards(playerCards);
        this.showSnackbarMessage(username.substring(0,10) + ' placed a stone on Ship ' + (move.ShipID+1) + '.');

        break;

      //Take card from market
      case PositionEnum.PlayerCardStack:
        console.log("OTHER PLAYER PICKED CARD: ", move.pos)
        this.removeCardById(move.pos);
        this.updatePlayerCards(playerCards);
        break;
    }

    //TODO cases for playing blue market cards - how does the backend pass this information?

  }

  //Sets interactions for active and inactive players
  setPlayerField(name: string){
    console.log("Active player name: ", name);
    this.game.currentActivePlayerField = this.nameToColourMap[name];
    console.log("Active player colour: ", this.game.currentActivePlayerField);

    //Status Update:
    //Determine whether you are the active player (set class variable)
    if(this.game.whoCanPickCard != this.myUserName)
      this.game.amI_CurrentActivePlayer= this.game.currentActivePlayerField===this.game.myPlayerField;
    else
      this.game.amI_CurrentActivePlayer = false;

    this.setActivePlayerfield(this.game.currentActivePlayerField);
  }

  //Called exactly once, when the server tells us the game has ended
  endGame(scores: number[]){

    //update scores in player field one last time
    for(let i = 0; i < this.game.players.length; i++)
    {
      this.playerMap[this.game.players[i].username].setScore(scores[i]);
    }

    //save score array from backend locally
    this.playerScores = scores;

    //sort player scores
    this.sortScores();

    this.showScoreboard();
  }

  showScoreboard(){
    document.getElementById('ngButton').click();
  }

  //Sort scores for end-game scoreboard
  sortScores(){

    for(let i = 0; i < this.playerNames.length; i++){

      this.nameAndScores.push(new UserNameAndScore(this.playerNames[i], this.playerScores[i]));
    }

    this.nameAndScores = this.nameAndScores.sort((n1,n2) => n2.score - n1.score);
  }

  updatePlayerCards(input: Map<string, MarketCard[]>){
    this.game.player1CardDeck = input[this.game.players[0].username];
    this.game.player2CardDeck = input[this.game.players[1].username];
    if(this.game.players.length > 2)
      this.game.player3CardDeck = input[this.game.players[2].username];
    if(this.game.players.length > 3)
      this.game.player4CardDeck = input[this.game.players[3].username];

    //display current numbers for everyone
    for(let i = 0; i < this.game.players.length; i++)
    {
      this.playerMap[this.game.players[i].username].updateCardNumbers();
    }
  }

  //===========================================================
  // SnackBar / Toast
  //===========================================================

  //show Snackbarinfo
  showSnackbarMessage(text_) {
    let text= text_;
    let time_= 3000; //show 10 seconds
    this.showSnackbarMessenger(text_,time_);
  }

  //Needs to be called in GameComponent.ngOnInit()
  generateSnackbarDiv(){

    jQuery('<div/>', {
      id: 'snackbar',
    }).appendTo('.game_footer');

    if(0){console.log((<any>$('#snackbar')))};
  }

  showSnackbarMessenger(textMessage, timeMilliSeconds) {

    (<any>$('#snackbar'))
      .text(textMessage)
      .addClass('show')
      .css({'visibility': 'visible'});

    setTimeout(() => {
        (<any>$('#snackbar'))
          .addClass('hide')
          .css({'visibility': 'hidden'});
        if (1) {console.log("showSnackbarMessenger_callback")};
      },
      timeMilliSeconds);

    if(1){console.log("showSnackbarMessenger")};
  }

  //=============================================================
  // Make active player fields glow
  //=============================================================

  setActivePlayerfield(currentActivePlayerField:ColourEnum){
    for(let player of this.game.players){
      let isThisFieldActive = (currentActivePlayerField == this.nameToColourMap[player.username]);
      this.playerMap[player.username].playerFieldGlow(isThisFieldActive)
      console.log("Player " + name + " is active? " + isThisFieldActive)
    }
  }

  //Show lever modal (for choosing stone order)
  showLeverModal(shipNr){
    let tempStones = new Array<Stone>();

    for(let i = 0; i < this.ships[shipNr].slots.length; i++){
      tempStones.push(this.ships[shipNr].slots[i]);
      this.ships[shipNr].slots[i] = null;
    }
    this.game.leverModalOpen = true;
    this.infoBoxComponent.showLeverModal(tempStones)
  }
}
