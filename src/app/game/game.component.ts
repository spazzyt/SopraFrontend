import {Component, OnInit, ViewChild, NgZone} from '@angular/core';
import {DragulaService} from "ng2-dragula";
import {GameService} from "../shared/services/game.service";
import {MarketComponent} from "./market/market.component";
import {DepartingHarbourComponent} from "./departing-harbour/departing-harbour.component";
import {PlayerComponent} from "./player/player.component";
import {BottomLeftComponent} from "./player/bottom-left/bottom-left.component";
import {TempleComponent} from "./temple/temple.component";
import {PyramidComponent} from "./pyramid/pyramid.component";
import {ObeliskComponent} from "./obelisk/obelisk.component";
import {SiteHarbourComponent} from "./site-harbour/site-harbour.component";
import {BurialChamberComponent} from "./burial-chamber/burial-chamber.component";
import {ShipComponent} from "./ship/ship.component";
import {BottomRightComponent} from "./player/bottom-right/bottom-right.component";
import {TopRightComponent} from "./player/top-right/top-right.component";
import {TopLeftComponent} from "./player/top-left/top-left.component";
import {CurrentGameState} from "../shared/models/current-game-state";
import {Decision} from "../shared/models/decision";
import {User} from "../shared/models/user";
import {Ship} from "../shared/models/ship";
import {Stone} from "../shared/models/stone";
import {childOfKind} from "tslint";
import {StoneQuarry} from "../shared/models/stone-quarry";
import {SupplySled} from "../shared/models/supply-sled";
import {Pyramid} from "../shared/models/pyramid";
import {Obelisk} from "../shared/models/obelisk";
import {BurialChamber} from "../shared/models/burial-chamber";
import {Market} from "../shared/models/market";
import {Temple} from "../shared/models/temple";
import {ColourEnum} from "../shared/models/colour.enum";
import {InfoBoxComponent} from "./info-box/info-box.component";
import {StoneComponent} from "./stone/stone.component";
import {Game} from "../shared/models/game";
import {MarketCard} from "../shared/models/market-card";
import {Router} from "@angular/router";

import {UserService} from "../shared/services/user.service";

import {ActivatedRoute} from "@angular/router";
import {Round} from "../shared/models/round";
import {GameStatusEnum} from "../shared/models/game-status.enum";
import {ActionEnum} from "../shared/models/action.enum";
import {PositionEnum} from "../shared/models/position.enum";
import {Action} from "../shared/models/action";
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

  // am I the current active player
  amI_CurrentActivePlayer:boolean;

  // my player field
  myPlayerField:ColourEnum;

  // player field of current active player
  currentActivePlayerField:ColourEnum;
  private playerMap: Map<any, any>;
  private colourMap: Map<any, any>;
  private nameToColourMap: Map<any, any>;


  // store ships via their id
  ships:Map<number,Ship> = new Map();


  // access map for all sites
  sites:Map<string,any> = new Map();


  // Current Target (Soll) Game state
  // ( current-game-state package from backend sent to all players)
  //currentTargetGameState:CurrentGameState;

  // Current Actual (Ist) Game state
  // ( current-game-state package from backend sent to all players)
  //currentActualGameState:CurrentGameState;

  // Last players move/action/decision
  // ( decision package from backend sent to not active players)
  //lastPlayerDecision:Decision;

  // Current active Player
  //currentActivePlayer:User;

  // Allowed moves/actions/decisions
  // ( decision package from backend sent to active player, (to not active players as info))
  //allowedActivePlayerDecisions:Decision;

  // Active player move/action/decision
  // (decision package from active player sent to backend)
  //chosenActivePlayerDecision:Decision;

  // Enable communication with DepartingHarbour
  @ViewChild(DepartingHarbourComponent) departingHarbourComponent:DepartingHarbourComponent;

  // Enable communication with SiteHarbour
  @ViewChild(SiteHarbourComponent) siteHarbourComponent:SiteHarbourComponent;

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



  shipsInDepartingHarbour:Ship[] = [];

  shipsInSiteHarbour:Ship[] = [];

  //===============
  //Constructor
  //===============
  constructor(private gameService: GameService,
              private wsService: WSService,
              private userService: UserService,
              private route: ActivatedRoute) {
  }


  //===========================================================
  // Test-Data: Instantiate fake data as input for test-methods
  //===========================================================

  //will later be fields of defined class variables above
  playerName_target:string="P1: Roland";
  marketCards_target:number[]=[1,0,2,0,1,1,0,0,4];
  score_target:number=12;
  sledStones_target:number=3;
  quarryStones_target:number=25;
  playerIconsStatus_target:boolean[]=[true, false, true, false, false, true, false, true, false];
  playerStoneQuarryStatus_target:boolean=false;
  playerSupplySledStatus_target:boolean=false;
  playerPlayerFieldStatus_target:boolean=false;
  roundNumber:number=3;
  glow_target:boolean=true;


  //Fake Ships
  ship1 = new Ship(1, 4);
  ship2 = new Ship(2, 3);
  ship3 = new Ship(3, 2);
  ship4 = new Ship(4, 1);

  ships_target = new Array<Ship>();

  //Fake Stones
  stone1 = new Stone(1, ColourEnum.brown);
  stone2 = new Stone(2, ColourEnum.white);
  stone3 = new Stone(3, ColourEnum.gray);
  stone4 = new Stone(4, ColourEnum.black);

  stones_target = new Array<Stone>();


  //Fake market cards at random
  id1=Math.floor(Math.random() * (6 - 1 + 1)) + 1;
  id2=Math.floor(Math.random() * (14 - 7 + 1)) + 7;
  id3=Math.floor(Math.random() * (25 - 15 + 1)) + 15;
  id4=Math.floor(Math.random() * (34 - 26 + 1)) + 26;

  marketCards = new Array<MarketCard>();


  //Fake Players
  player1= new User(1, "david", ColourEnum.black);
  player2= new User(2, "vincent", ColourEnum.white);
  player3= new User(3, "kenny", ColourEnum.brown);
  player4= new User(4, "roland", ColourEnum.gray);

  players_target = new Array<User>();


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

          //Initialize the new game
          this.initializeNewGame(this.game);




          //Initialize the whole market card set
          for (let i=1; i<=34; i++){
            //this.game.wholeMarketCardSet.push(new MarketCard(i)); //TODO is this needed? see below
          }

          console.log("Initializing game with id: ", id, game);

          // Now we need to connect via websockets and listen for gamestate updates
          this.wsService.connectToGame(id, this);
        });
    }

    //TODO is this needed? implement later if yes
    //Initialize the new game
    //this.initializeNewGame(this.getFakeGame());

    //Initialize the whole market card set
    //for (let i=1; i<=34; i++){
    //  this.game.wholeMarketCardSet.push(new MarketCard(i));
    //}

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
  // Backend starts new game
  //===========================================================

  //Fake Game
  getFakeGame(){

    console.log("DO NOT USE THE FAKE GAME ANYMORE!!!!");

    //fill fake stone array
    this.stones_target.push(this.stone1);
    this.stones_target.push(this.stone2);
    this.stones_target.push(this.stone3);
    this.stones_target.push(this.stone4);

    //fill fake ship array
    this.ships_target.push(this.ship1);
    this.ships_target.push(this.ship2);
    this.ships_target.push(this.ship3);
    this.ships_target.push(this.ship4);

    //fill fake player array
    this.players_target.push(this.player1,);
    this.players_target.push(this.player2,);
    this.players_target.push(this.player3,);
    this.players_target.push(this.player4,);

    //Fake current active player field
    //this.game.currentActivePlayerField=ColourEnum.black;



    let returnGame = new Game(0, 'token', 'name', GameStatusEnum.RUNNING, 4,  this.players_target, 1, this.ships_target, this.marketCards, this.game.currentActivePlayerField, null);
    return returnGame;

  }


  //===========================================================
  // Initialize the new game:
  // All components, mySelf (either active or inactive player)
  //===========================================================

  initializeNewGame(game_backend:Game){

    //set class variable
    let game = new Game(game_backend.id, game_backend.token, game_backend.name, game_backend.status, game_backend.numPlayers, game_backend.players, game_backend.roundNumber, game_backend.ships, game_backend.marketCards, game_backend.currentActivePlayerField);
    this.game = game;

    //set username in game model
    this.game.myUserName = this.myUserName;

    //pass game information to gameService
    this.gameService.setGame(this.game);

    //TODO delete as soon as we get proper market cards from backend
    //let fakegame = this.getFakeGame();

    //fill ship array with nulls
    this.game.ships = [null, null, null, null];

    //Site Board Components: the island
    this.initializeObeliskComponent();
    this.initializePyramidComponent();
    this.initializeTempleComponent();
    this.initializeBurialChamberComponent();

    this.shipsInDepartingHarbour = this.game.ships;

    this.shipsInSiteHarbour = [];

    //Departing Harbour: the ships
    this.initializeDepartingHarbourComponent(this.game.ships);

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

    //Determine whether you are the active player (set class variable)
    let amI_CurrentActivePlayer=this.game.currentActivePlayerField===this.game.myPlayerField;
    this.amI_CurrentActivePlayer=amI_CurrentActivePlayer; //important for dragula to work

    //Read current active player field (set class variable)
    let currentActivePlayerField=this.game.currentActivePlayerField;

    //Initialize Myself
    //(depends on whether you are the active or inactive player)
    this.initializeMySelf(amI_CurrentActivePlayer, currentActivePlayerField);
  }

  // Init Sites
  //-----------
  initializeMarketComponent(){
    this.marketComponent.removeUnusedMarketCards();
    //do not set click handlers here
  }

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


  // Init Departing Harbour and Ships
  // (no click handlers on stones: only set after blue lever market card was played)
  //---------------------------------
  initializeDepartingHarbourComponent(ships:Ship[]){
    this.departingHarbourComponent.removeShips();
    this.departingHarbourComponent.generateFourShips(ships);
  }

  // Init Player Components (what everyone concerns)
  //------------------------------------------------
  initializePlayerComponents(players_:User[], numPlayers_:number) {

    for (let i = 0; i < numPlayers_; i++) {

      //bottomLeftComponent
      //-------------------
      if(i==0){
        if(0){console.log("initialize BottomLeftComponent");}

        // set market card icon number to zero
        this.bottomLeftComponent.setMarketCards([0,0,0,0,0,0,0,0,0]);

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

        // set market card icon number to zero
        this.topLeftComponent.setMarketCards([0,0,0,0,0,0,0,0,0]);

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

        // set market card icon number to zero
        this.topRightComponent.setMarketCards([0,0,0,0,0,0,0,0,0]);

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

        // set market card icon number to zero
        this.bottomRightComponent.setMarketCards([0,0,0,0,0,0,0,0,0]);

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


  // Init MySelf ( depending on whether you are the active or inactive player)
  //--------------------------------------------------------------------------
  initializeMySelf(amI_CurrentActivePlayer:boolean,
                   currentActivePlayerField:ColourEnum){


    if(1){console.log("initializeMySelf: ", {amI_CurrentActivePlayer, currentActivePlayerField})};

    //I am the active player
    //----------------------
    if (amI_CurrentActivePlayer){


      //I am active player on black field
      //--------------------------------
      if(currentActivePlayerField===ColourEnum.black){

        //show my stone in sled, hide the others
        this.bottomLeftComponent.showStone();
        this.topLeftComponent.hideStone();
        this.topRightComponent.hideStone();
        this.bottomRightComponent.hideStone();

        //let active player field glow, not the others
        this.bottomLeftComponent.playerFieldGlow(true);
        this.topLeftComponent.playerFieldGlow(false);
        this.topRightComponent.playerFieldGlow(false);
        this.bottomRightComponent.playerFieldGlow(false);

        //switch on click handlers on Blue Market Icons in own player field,
        // remove the others
        this.bottomLeftComponent.setClickHandlerOnBlueMarketCards();
        this.topLeftComponent.removeClickHandlerOnBlueMarketCards();
        this.topRightComponent.removeClickHandlerOnBlueMarketCards();
        this.bottomRightComponent.removeClickHandlerOnBlueMarketCards();

        //switch off all Market Icon colors since no one has any
        this.bottomLeftComponent.deactivateOrActivateIcons([false,false,false,false,false,false,false,false,false]);
        this.bottomRightComponent.deactivateOrActivateIcons([false,false,false,false,false,false,false,false,false]);
        this.topLeftComponent.deactivateOrActivateIcons([false,false,false,false,false,false,false,false,false]);
        this.topRightComponent.deactivateOrActivateIcons([false,false,false,false,false,false,false,false,false]);

        //switch on your Quarry colors, switch off the others
        this.bottomLeftComponent.deactivateOrActivateStoneQuarry(true);
        this.topLeftComponent.deactivateOrActivateStoneQuarry(false);
        this.topRightComponent.deactivateOrActivateStoneQuarry(false);
        this.bottomRightComponent.deactivateOrActivateStoneQuarry(false);

        //switch on your Sled colors, switch off the others
        this.bottomLeftComponent.deactivateOrActivateSupplySled(true);
        this.topLeftComponent.deactivateOrActivateSupplySled(false);
        this.topRightComponent.deactivateOrActivateSupplySled(false);
        this.bottomRightComponent.deactivateOrActivateSupplySled(false);

        //switch on your Score colors, switch off the others
        this.bottomLeftComponent.deactivateOrActivateScore(true);
        this.topLeftComponent.deactivateOrActivateScore(false);
        this.topRightComponent.deactivateOrActivateScore(false);
        this.bottomRightComponent.deactivateOrActivateScore(false);

        // switch on click handlers on market site
        this.marketComponent.setClickHandlerOnMarketCards();

        // switch on click handlers on your stone quarry, switch off the others
        this.bottomLeftComponent.setClickHandlerOnStoneQuarry();
        this.topLeftComponent.removeClickHandlerOnStoneQuarry();
        this.topRightComponent.removeClickHandlerOnStoneQuarry();
        this.bottomRightComponent.removeClickHandlerOnStoneQuarry();

      }

      //I am active player on white field
      //--------------------------------
      else if(this.myPlayerField===ColourEnum.white){

        //show my stone in sled, hide the others
        this.bottomLeftComponent.hideStone();
        this.topLeftComponent.showStone();
        this.topRightComponent.hideStone();
        this.bottomRightComponent.hideStone();

        //let active player field glow, not the others
        this.bottomLeftComponent.playerFieldGlow(false);
        this.topLeftComponent.playerFieldGlow(true);
        this.topRightComponent.playerFieldGlow(false);
        this.bottomRightComponent.playerFieldGlow(false);

        //switch on click handlers on Blue Market Icons in own player field
        this.bottomLeftComponent.removeClickHandlerOnBlueMarketCards();
        this.topLeftComponent.setClickHandlerOnBlueMarketCards();
        this.topRightComponent.removeClickHandlerOnBlueMarketCards();
        this.bottomRightComponent.removeClickHandlerOnBlueMarketCards();

        //switch off all Market Icon colors since no one has any
        this.bottomLeftComponent.deactivateOrActivateIcons([false,false,false,false,false,false,false,false,false]);
        this.bottomRightComponent.deactivateOrActivateIcons([false,false,false,false,false,false,false,false,false]);
        this.topLeftComponent.deactivateOrActivateIcons([false,false,false,false,false,false,false,false,false]);
        this.topRightComponent.deactivateOrActivateIcons([false,false,false,false,false,false,false,false,false]);

        //switch on your Quarry colors, switch off the others
        this.bottomLeftComponent.deactivateOrActivateStoneQuarry(false);
        this.topLeftComponent.deactivateOrActivateStoneQuarry(true);
        this.topRightComponent.deactivateOrActivateStoneQuarry(false);
        this.bottomRightComponent.deactivateOrActivateStoneQuarry(false);

        //switch on your Sled colors, switch off the others
        this.bottomLeftComponent.deactivateOrActivateSupplySled(false);
        this.topLeftComponent.deactivateOrActivateSupplySled(true);
        this.topRightComponent.deactivateOrActivateSupplySled(false);
        this.bottomRightComponent.deactivateOrActivateSupplySled(false);

        //switch on your Score colors, switch off the others
        this.bottomLeftComponent.deactivateOrActivateScore(false);
        this.topLeftComponent.deactivateOrActivateScore(true);
        this.topRightComponent.deactivateOrActivateScore(false);
        this.bottomRightComponent.deactivateOrActivateScore(false);

        // switch on click handlers on market site
        this.marketComponent.setClickHandlerOnMarketCards();

        // switch on click handlers on your stone quarry, switch off the others
        this.bottomLeftComponent.removeClickHandlerOnStoneQuarry();
        this.topLeftComponent.setClickHandlerOnStoneQuarry();
        this.topRightComponent.removeClickHandlerOnStoneQuarry();
        this.bottomRightComponent.removeClickHandlerOnStoneQuarry();

      }

      //I am active player on brown field
      //--------------------------------
      else if(this.myPlayerField===ColourEnum.brown){

        //show my stone in sled, hide the others
        this.bottomLeftComponent.hideStone();
        this.topLeftComponent.hideStone();
        this.topRightComponent.showStone();
        this.bottomRightComponent.hideStone();

        //let active player field glow, not the others
        this.bottomLeftComponent.playerFieldGlow(false);
        this.topLeftComponent.playerFieldGlow(false);
        this.topRightComponent.playerFieldGlow(true);
        this.bottomRightComponent.playerFieldGlow(false);

        ///switch on click handlers on Blue Market Icons in own player field
        this.bottomLeftComponent.removeClickHandlerOnBlueMarketCards();
        this.topLeftComponent.removeClickHandlerOnBlueMarketCards();
        this.topRightComponent.setClickHandlerOnBlueMarketCards();
        this.bottomRightComponent.removeClickHandlerOnBlueMarketCards();

        //switch off all Market Icon colors since no one has any
        this.bottomLeftComponent.deactivateOrActivateIcons([false,false,false,false,false,false,false,false,false]);
        this.bottomRightComponent.deactivateOrActivateIcons([false,false,false,false,false,false,false,false,false]);
        this.topLeftComponent.deactivateOrActivateIcons([false,false,false,false,false,false,false,false,false]);
        this.topRightComponent.deactivateOrActivateIcons([false,false,false,false,false,false,false,false,false]);


        //switch on your Quarry colors, switch off the others
        this.bottomLeftComponent.deactivateOrActivateStoneQuarry(false);
        this.topLeftComponent.deactivateOrActivateStoneQuarry(false);
        this.topRightComponent.deactivateOrActivateStoneQuarry(true);
        this.bottomRightComponent.deactivateOrActivateStoneQuarry(false);

        //switch on your Sled colors, switch off the others
        this.bottomLeftComponent.deactivateOrActivateSupplySled(false);
        this.topLeftComponent.deactivateOrActivateSupplySled(false);
        this.topRightComponent.deactivateOrActivateSupplySled(true);
        this.bottomRightComponent.deactivateOrActivateSupplySled(false);

        //switch on your Score colors, switch off the others
        this.bottomLeftComponent.deactivateOrActivateScore(false);
        this.topLeftComponent.deactivateOrActivateScore(false);
        this.topRightComponent.deactivateOrActivateScore(true);
        this.bottomRightComponent.deactivateOrActivateScore(false);

        // switch on click handlers on market site
        this.marketComponent.setClickHandlerOnMarketCards();

        // switch on click handlers on your stone quarry, switch off the others
        this.bottomLeftComponent.removeClickHandlerOnStoneQuarry();
        this.topLeftComponent.removeClickHandlerOnStoneQuarry();
        this.topRightComponent.setClickHandlerOnStoneQuarry();
        this.bottomRightComponent.removeClickHandlerOnStoneQuarry();


      }

      //I am active player on gray field
      //-------------------------------
      if(this.myPlayerField===ColourEnum.gray){

        //show my stone in sled, hide the others
        this.bottomLeftComponent.hideStone();
        this.topLeftComponent.hideStone();
        this.topRightComponent.hideStone();
        this.bottomRightComponent.showStone();

        //let active player field glow, not the others
        this.bottomLeftComponent.playerFieldGlow(false);
        this.topLeftComponent.playerFieldGlow(false);
        this.topRightComponent.playerFieldGlow(false);
        this.bottomRightComponent.playerFieldGlow(true);

        //switch on click handlers on Blue Market Icons in own player field
        this.bottomLeftComponent.removeClickHandlerOnBlueMarketCards();
        this.topLeftComponent.removeClickHandlerOnBlueMarketCards();
        this.topRightComponent.removeClickHandlerOnBlueMarketCards();
        this.bottomRightComponent.setClickHandlerOnBlueMarketCards();

        //switch off all Market Icon colors since no one has any
        this.bottomLeftComponent.deactivateOrActivateIcons([false,false,false,false,false,false,false,false,false]);
        this.bottomRightComponent.deactivateOrActivateIcons([false,false,false,false,false,false,false,false,false]);
        this.topLeftComponent.deactivateOrActivateIcons([false,false,false,false,false,false,false,false,false]);
        this.topRightComponent.deactivateOrActivateIcons([false,false,false,false,false,false,false,false,false]);

        //switch on your Quarry colors, switch off the others
        this.bottomLeftComponent.deactivateOrActivateStoneQuarry(false);
        this.topLeftComponent.deactivateOrActivateStoneQuarry(false);
        this.topRightComponent.deactivateOrActivateStoneQuarry(false);
        this.bottomRightComponent.deactivateOrActivateStoneQuarry(true);

        //switch on your Sled colors, switch off the others
        this.bottomLeftComponent.deactivateOrActivateSupplySled(false);
        this.topLeftComponent.deactivateOrActivateSupplySled(false);
        this.topRightComponent.deactivateOrActivateSupplySled(false);
        this.bottomRightComponent.deactivateOrActivateSupplySled(true);

        //switch on your Score colors, switch off the others
        this.bottomLeftComponent.deactivateOrActivateScore(false);
        this.topLeftComponent.deactivateOrActivateScore(false);
        this.topRightComponent.deactivateOrActivateScore(false);
        this.bottomRightComponent.deactivateOrActivateScore(true);

        // switch on click handlers on market site
        this.marketComponent.setClickHandlerOnMarketCards();

        // switch on click handlers on your stone quarry, switch off the others
        this.bottomLeftComponent.removeClickHandlerOnStoneQuarry();
        this.topLeftComponent.removeClickHandlerOnStoneQuarry();
        this.topRightComponent.removeClickHandlerOnStoneQuarry();
        this.bottomRightComponent.setClickHandlerOnStoneQuarry();

      }

    }

    //I am an inactive player
    //-----------------------
    else{

      //hide all stones in sleds
      this.bottomLeftComponent.hideStone();
      this.topLeftComponent.hideStone();
      this.topRightComponent.hideStone();
      this.bottomRightComponent.hideStone();

      //let active player field glow, not the others
      if(currentActivePlayerField===ColourEnum.black){
        this.bottomLeftComponent.playerFieldGlow(true);
        this.topLeftComponent.playerFieldGlow(false);
        this.topRightComponent.playerFieldGlow(false);
        this.bottomRightComponent.playerFieldGlow(false);
      }
      if(currentActivePlayerField===ColourEnum.white){
        this.bottomLeftComponent.playerFieldGlow(false);
        this.topLeftComponent.playerFieldGlow(true);
        this.topRightComponent.playerFieldGlow(false);
        this.bottomRightComponent.playerFieldGlow(false);
      }
      if(currentActivePlayerField===ColourEnum.brown){
        this.bottomLeftComponent.playerFieldGlow(false);
        this.topLeftComponent.playerFieldGlow(false);
        this.topRightComponent.playerFieldGlow(true);
        this.bottomRightComponent.playerFieldGlow(false);
      }
      if(currentActivePlayerField===ColourEnum.gray){
        this.bottomLeftComponent.playerFieldGlow(false);
        this.topLeftComponent.playerFieldGlow(false);
        this.topRightComponent.playerFieldGlow(false);
        this.bottomRightComponent.playerFieldGlow(true);
      }

      //switch off click handlers on Blue Market Icons in player fields
      this.bottomLeftComponent.removeClickHandlerOnBlueMarketCards();
      this.bottomRightComponent.removeClickHandlerOnBlueMarketCards();
      this.topLeftComponent.removeClickHandlerOnBlueMarketCards();
      this.topRightComponent.removeClickHandlerOnBlueMarketCards();

      //switch off Market Icon colors
      this.bottomLeftComponent.deactivateOrActivateIcons([false,false,false,false,false,false,false,false,false]);
      this.bottomRightComponent.deactivateOrActivateIcons([false,false,false,false,false,false,false,false,false]);
      this.topLeftComponent.deactivateOrActivateIcons([false,false,false,false,false,false,false,false,false]);
      this.topRightComponent.deactivateOrActivateIcons([false,false,false,false,false,false,false,false,false]);

      //switch off Quarry colors
      this.bottomLeftComponent.deactivateOrActivateStoneQuarry(false);
      this.bottomRightComponent.deactivateOrActivateStoneQuarry(false);
      this.topLeftComponent.deactivateOrActivateStoneQuarry(false);
      this.topRightComponent.deactivateOrActivateStoneQuarry(false);

      //switch off Sled colors
      this.bottomLeftComponent.deactivateOrActivateSupplySled(false);
      this.bottomRightComponent.deactivateOrActivateSupplySled(false);
      this.topLeftComponent.deactivateOrActivateSupplySled(false);
      this.topRightComponent.deactivateOrActivateSupplySled(false);

      //switch off your Score colors
      this.bottomLeftComponent.deactivateOrActivateScore(false);
      this.topLeftComponent.deactivateOrActivateScore(false);
      this.topRightComponent.deactivateOrActivateScore(false);
      this.bottomRightComponent.deactivateOrActivateScore(false);

      // switch off click handlers on market site
      this.marketComponent.removeClickHandlerOnMarketCards();

      // switch off click handlers on all stone quarries
      this.bottomLeftComponent.removeClickHandlerOnStoneQuarry();
      this.topLeftComponent.removeClickHandlerOnStoneQuarry();
      this.topRightComponent.removeClickHandlerOnStoneQuarry();
      this.bottomRightComponent.removeClickHandlerOnStoneQuarry();

    }

  }


  //===========================================================
  // Backend starts new round
  //===========================================================

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

    this.game.marketCards = round.marketCards; //TODO fix this

    this.initializeMarketComponent();

    //initialize with new ships
    this.initializeDepartingHarbourComponent(this.game.ships);

    //increase round in info box
    this.infoBoxComponent.increaseRoundInInfoBox(round.roundNumber);

    //set current score for each player
    for(let player of this.game.players){
      this.playerMap[player.username].setScore(round.berlinerScore[player.username]);
    }


  }



  //===========================================================
  // Backend starts fast forward at the end of the game
  //===========================================================

  initFastForward(){




  }

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
      this.playerMap[player.username].checkStonesDragable();
    }
  }

  //===========================================================
  // Update Game UI for one Move of another client
  //===========================================================

  updateUiForOneMove2(move: Move, username: string, berlinerScore: Map<string, number>, sleds: Map<string, number>, quarries: Map<string, number>){

    //only set stones to draggable if player has stones
    this.updateStoneDragStatus();

    console.log('Updating UI for this move: ', move, " by Player ", username);


    //SWITCH based on what move the backend sent us
    switch(move.to){

      //Take stones from quarry
      case PositionEnum.Sled:
        this.playerMap[username].update_takeStonesFromQuarry(move.pos);

        //update score, sled & quarry
        this.updateScoreSledQuarry(berlinerScore, sleds, quarries);


        break;


      //TODO condense the site functions (except market) into one single function
      //Sail ship to Pyramid:
      case PositionEnum.Pyramid:
        this.moveShipById(move.pos, 'Pyramid');
        console.log("PLACING ON PYRAMID FROM OTHER'S MOVE: ", move.pos, this.game.ships[move.pos])
        //place stones on site
        this.pyramidComponent.placeStones(this.game.ships[move.pos].slots);
        //remove stones from ship
        this.game.ships[move.pos].slots = [];

        //update score, sled & quarry
        this.updateScoreSledQuarry(berlinerScore, sleds, quarries);

        break;

      //Sail ship to Temple:
      case PositionEnum.Temple:
        this.moveShipById(move.pos, 'Temple');
        console.log("PLACING ON TEMPLE FROM OTHER'S MOVE: ", move.pos, this.game.ships[move.pos])
        this.templeComponent.placeStones(this.game.ships[move.pos].slots);
        //remove stones from ship
        this.game.ships[move.pos].slots = [];

        //update score, sled & quarry
        this.updateScoreSledQuarry(berlinerScore, sleds, quarries);

        break;

      //Sail ship to Burial Chamber:
      case PositionEnum.BurialChamber:
        this.moveShipById(move.pos, 'BurialChamber');
        console.log("PLACING ON BURIALCHAMBER FROM OTHER'S MOVE: ", move.pos, this.game.ships[move.pos])
        this.burialChamberComponent.placeStones(this.game.ships[move.pos].slots);
        //remove stones from ship
        this.game.ships[move.pos].slots = [];

        //update score, sled & quarry
        this.updateScoreSledQuarry(berlinerScore, sleds, quarries);

        break;

      //Sail ship to Obelisk:
      case PositionEnum.Obelisk:
        this.moveShipById(move.pos, 'Obelisk');
        console.log("PLACING ON OBELISK FROM OTHER'S MOVE: ", move.pos, this.game.ships[move.pos])
        this.obeliskComponent.placeStones(this.game.ships[move.pos].slots);
        //remove stones from ship
        this.game.ships[move.pos].slots = [];

        //update score, sled & quarry
        this.updateScoreSledQuarry(berlinerScore, sleds, quarries);

        break;


      //Sail ship to Market:
      case PositionEnum.Market:
        this.moveShipById(move.pos, 'Market');

        //remove stones from ship
        this.game.ships[move.pos].slots = [];

        break;


      //Place stone on ship:
      case PositionEnum.DepartingHarbour:
        //TODO check if this delivers the proper stone colour
        let stoneToAdd = new Stone(-1, this.nameToColourMap[username]);
        this.ships[move.ShipID].addStoneById(stoneToAdd, move.pos);

        //update score, sled & quarry
        this.updateScoreSledQuarry(berlinerScore, sleds, quarries);

        break;
    }

  }


  //TODO implement these cases (for playing cards)
  /*
      //Played Blue Market Card Hammer
      //------------------------------
      else if (lastDecisionActionName === ActionEnum.playBlueMarketCardHammer) {

        //update Numbers on PlayerField: Quarry, Sled
        this.updatePlayerData();

        //show stone on ship
        this.updateStoneOnShip();

        //show Snackbarinfo
        let text="replace this string";
        this.showSnackbarMessage(text);

      }

      //Played Blue Market Card Sail
      //----------------------------
      else if (lastDecisionActionName === ActionEnum.playBlueMarketCardSail) {

        //update Numbers on PlayerField: Sled
        this.updatePlayerData();

        //show stone on ship
        this.updateStoneOnShip();

        //remove ship from departing harbour
        //this.removeShipFromDepartingHarbour();

        //add ship to arriving harbour
        //this.addShipToArrivingHarbour();

        //place stones to site
        this.placeStonesToSite();

        //show Snackbarinfo
        let text="replace this string";
        this.showSnackbarMessage(text);

      }

      //Played Blue Market Card Chisel
      //------------------------------
      else if (lastDecisionActionName === ActionEnum.playBlueMarketCardChisel) {

        //update Numbers on PlayerField: Sled
        this.updatePlayerData();

        //show stone on ship
        this.updateStoneOnShip();

        //show stone on ship
        this.updateStoneOnShip();

        //show Snackbarinfo
        let text="replace this string";
        this.showSnackbarMessage(text);

      }
*/
  /*
      //Played Blue Market Card Lever (Sail Ship to left side of island)
      //----------------------------------------------------------------
      else if (lastDecisionActionName === ActionEnum.playBlueMarketCardLever
          && !(lastDecisionActionName2 === ActionEnum.sailShipToMarket)) {

        //update Numbers on PlayerField: Sled
        this.updatePlayerData();

        //remove ship from departing harbour
        //this.removeShipFromDepartingHarbour();

        //add ship to arriving harbour
        //this.addShipToArrivingHarbour();

        //place stones to site
        this.placeStonesToSite();

        //show Snackbarinfo
        let text="replace this string";
        this.showSnackbarMessage(text);

      }

      //Played Blue Market Card Lever (Sail Ship to market)
      //---------------------------------------------------
      else if (lastDecisionActionName === ActionEnum.playBlueMarketCardLever
        && (lastDecisionActionName2 === ActionEnum.sailShipToMarket)) {

        //remove ship from departing harbour
        //this.removeShipFromDepartingHarbour();

        //add ship to arriving harbour
        //this.addShipToArrivingHarbour();

        //switch order of stones on ship
        this.switchOrderOfStonesOnShip();

        //show Snackbarinfo
        let text="replace this string"
        this.showSnackbarMessage(text);

      }

    }

  }
*/

  //------------------
  //helper functions
  //------------------

  setPlayerField(name: string){
    console.log("Active player name: ", name);
    this.game.currentActivePlayerField = this.nameToColourMap[name];
    console.log("Active player colour: ", this.game.currentActivePlayerField);

    //Status Update:
    //Determine whether you are the active player (set class variable)
    this.game.amI_CurrentActivePlayer=this.game.currentActivePlayerField===this.game.myPlayerField;
    this.amI_CurrentActivePlayer=this.game.amI_CurrentActivePlayer; //important for dragula to work



    this.activateActivePlayerInteractions(this.game.amI_CurrentActivePlayer, this.game.currentActivePlayerField);
    this.deactivateInactivePlayerInteractions(this.game.amI_CurrentActivePlayer, this.game.currentActivePlayerField);
  }

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
    document.getElementById('ngButton').click()
    //TODO add functionality for showing modal through this function
  }


  sortScores(){

    for(let i = 0; i < this.playerNames.length; i++){

      this.nameAndScores.push(new UserNameAndScore(this.playerNames[i], this.playerScores[i]));
    }

    this.nameAndScores = this.nameAndScores.sort((n1,n2) => n2.score - n1.score);

  }


  //add ship to arriving harbour
  addShipToArrivingHarbour(target: PositionEnum, shipid: number){
    let shipToAdd = this.departingHarbourComponent.ships[shipid];

    if(target != PositionEnum.Market) {
      this.siteHarbourComponent.addShipToHarbour(target, shipToAdd);
    }
    else{
      //this.marketHarbourComponent.addShipToHarbour(shipToAdd); //TODO add ship to market
    }

    //remove ship from departing harbour
    this.departingHarbourComponent.removeShip(shipid);
  }

  //===========================================================
  // Update data for one player field
  // e.g. helper function for function like "updateUiForOneMove()"
  //===========================================================

  //TODO add input, pass input to mapFromServer... function
  updatePlayerData(){

    let input = this.mapFromServerToUpdatePlayerDataArray();
    this.updatePlayerDataWithArray(input, ColourEnum.black);

  }

  //TODO add input data format
  private mapFromServerToUpdatePlayerDataArray(){

    let returnArray = [1,2,3,4,5,6,7,8,9,10,11,12];
    return returnArray;

  }

  // Input array format:
  //====================
  //
  // [Score, Sled, Quarry, Statue, PyrDec, TemDec, BurDec, ObeDec, Chisel, Hammer, Sail, Lever]
  //    0      1      2      3        4       5       6      7        8      9      10     11
  //
  //
  //private updatePlayerDataWithArray(input: number[], playerField: ColourEnum)
  //set values of indices that should not change to null!!
  //======================================================================================
  //private updateGameModelPlayerData_increaseByNumber(input_: number[], playerField_: ColourEnum)
  //private updatePlayerDataWithArray_increaseByNumber(input: number[], playerField: ColourEnum)
  //set values of indices that should not change to 0;
  //======================================================================================

  private updateGameModelPlayerData_increaseByNumber(ArrayOf0To11: number[], playerField_: ColourEnum){

    // [Score, Sled, Quarry, Statue, PyrDec, TemDec, BurDec, ObeDec, Chisel, Hammer, Sail, Lever]
    //    0      1      2      3        4       5       6      7        8      9      10     11


    if(playerField_==ColourEnum.black){
      for(let i = 0; i < ArrayOf0To11.length; i++){
        console.log("this works", ArrayOf0To11, this.game);
        this.game.playerFieldIconsBlack[i] += ArrayOf0To11[i];
        console.log("that works");

      }
    }
    if(playerField_==ColourEnum.white){
      for(let i = 0; i < ArrayOf0To11.length; i++){
        this.game.playerFieldIconsWhite[i] += ArrayOf0To11[i];
      }
    }
    if(playerField_==ColourEnum.brown){
      for(let i = 0; i < ArrayOf0To11.length; i++){
        this.game.playerFieldIconsBrown[i] += ArrayOf0To11[i];
      }
    }
    if(playerField_==ColourEnum.gray){
      for(let i = 0; i < ArrayOf0To11.length; i++){
        this.game.playerFieldIconsGray[i] += ArrayOf0To11[i];
      }
    }
  }

  private updatePlayerDataWithArray_increaseByNumber(ArrayOf0To11: number[], playerField: ColourEnum){

    if(playerField == ColourEnum.black){
      this.bottomLeftComponent.setPlayerDataWithArray_increaseByNumber(ArrayOf0To11);
    }
    else if(playerField == ColourEnum.white){
      this.topLeftComponent.setPlayerDataWithArray_increaseByNumber(ArrayOf0To11);
    }
    else if(playerField == ColourEnum.brown){
      this.topRightComponent.setPlayerDataWithArray_increaseByNumber(ArrayOf0To11);
    }
    else if(playerField == ColourEnum.gray){
      this.bottomRightComponent.setPlayerDataWithArray_increaseByNumber(ArrayOf0To11);
    }

  }


  private updatePlayerDataWithArray(input: number[], playerField: ColourEnum){

    if(playerField == ColourEnum.black){    //BLACK player field

      if(input[0] != null){   //score
        this.bottomLeftComponent.setScore(input[0]);
      }
      if(input[1] != null){   //sled
        this.bottomLeftComponent.setStonesInSled(input[1]);
      }
      if(input[2] != null){   //quarry
        this.bottomLeftComponent.setStonesInQuarry(input[2]);
      }

      //pass icon data:

      let iconArray = new Array<number>();

      for(let i = 3; i < 12; i++){
        iconArray[i] = input[i];
      }
      this.bottomLeftComponent.setMarketCards(iconArray);


    }
    else if(playerField == ColourEnum.white){

      if(input[0] != null){   //score
        this.topLeftComponent.setScore(input[0]);
      }
      if(input[1] != null){   //sled
        this.topLeftComponent.setStonesInSled(input[1]);
      }
      if(input[2] != null){   //quarry
        this.topLeftComponent.setStonesInQuarry(input[2]);
      }

      //pass icon data:

      let iconArray = new Array<number>();

      for(let i = 3; i < 12; i++){
        iconArray[i] = input[i];
      }
      this.topLeftComponent.setMarketCards(iconArray);

    }
    else if(playerField == ColourEnum.brown){

      if(input[0] != null){   //score
        this.topRightComponent.setScore(input[0]);
      }
      if(input[1] != null){   //sled
        this.topRightComponent.setStonesInSled(input[1]);
      }
      if(input[2] != null){   //quarry
        this.topRightComponent.setStonesInQuarry(input[2]);
      }

      //pass icon data:

      let iconArray = new Array<number>();

      for(let i = 3; i < 12; i++){
        iconArray[i] = input[i];
      }
      this.topRightComponent.setMarketCards(iconArray);

    }
    else if(playerField == ColourEnum.gray){

      if(input[0] != null){   //score
        this.bottomRightComponent.setScore(input[0]);
      }
      if(input[1] != null){   //sled
        this.bottomRightComponent.setStonesInSled(input[1]);
      }
      if(input[2] != null){   //quarry
        this.bottomRightComponent.setStonesInQuarry(input[2]);
      }

      //pass icon data:

      let iconArray = new Array<number>();

      for(let i = 3; i < 12; i++){
        iconArray[i] = input[i];
      }
      this.bottomRightComponent.setMarketCards(iconArray);

    }

  }

  //===========================================================
  // Update data on site board
  // e.g. helper function for function like "updateUiForOneMove()"
  //===========================================================

  //TODO add input, pass input to mapFromServer... function
  updateSiteData(){

    let input = this.mapFromServerToUpdateSiteDataArray();
    this.updateSiteDataWithArray(input, ColourEnum.black);
    this.updateGameModelSiteData(input, ColourEnum.black);

  }

  //TODO add input data format
  private mapFromServerToUpdateSiteDataArray(){

    let returnArray = [1,2,3,4,5,6,7,8,9,10,11,12];
    return returnArray;

  }

  // Input array format:
  //====================
  //


  private updateGameModelSiteData(input_: number[], playerField_: ColourEnum){


  }


  private updateSiteDataWithArray(input: number[], playerField: ColourEnum){



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

  //===========================================================
  // Main Task 1: Inactive Players: Make them passive
  //===========================================================

  deactivateInactivePlayerInteractions(amI_CurrentActivePlayer:boolean,
                                       currentActivePlayerField:ColourEnum){

    //I am an inactive player
    //-----------------------
    if (!amI_CurrentActivePlayer){

      //------------------------------------------
      // TODO automatically deactivate all ships
      //------------------------------------------

      //hide all stones in sleds (no see, no touch)
      //-------------------------------------------
      this.bottomLeftComponent.hideStone();
      this.topLeftComponent.hideStone();
      this.topRightComponent.hideStone();
      this.bottomRightComponent.hideStone();

      //let active player field glow, not the others
      //--------------------------------------------
      if(currentActivePlayerField===ColourEnum.black){
        this.bottomLeftComponent.playerFieldGlow(true);
        this.topLeftComponent.playerFieldGlow(false);
        this.topRightComponent.playerFieldGlow(false);
        this.bottomRightComponent.playerFieldGlow(false);
      }
      if(currentActivePlayerField===ColourEnum.white){
        this.bottomLeftComponent.playerFieldGlow(false);
        this.topLeftComponent.playerFieldGlow(true);
        this.topRightComponent.playerFieldGlow(false);
        this.bottomRightComponent.playerFieldGlow(false);
      }
      if(currentActivePlayerField===ColourEnum.brown){
        this.bottomLeftComponent.playerFieldGlow(false);
        this.topLeftComponent.playerFieldGlow(false);
        this.topRightComponent.playerFieldGlow(true);
        this.bottomRightComponent.playerFieldGlow(false);
      }
      if(currentActivePlayerField===ColourEnum.gray){
        this.bottomLeftComponent.playerFieldGlow(false);
        this.topLeftComponent.playerFieldGlow(false);
        this.topRightComponent.playerFieldGlow(false);
        this.bottomRightComponent.playerFieldGlow(true);
      }

      //switch off click handlers on Blue Market Icons in player fields
      //---------------------------------------------------------------
      this.bottomLeftComponent.removeClickHandlerOnBlueMarketCards();
      this.bottomRightComponent.removeClickHandlerOnBlueMarketCards();
      this.topLeftComponent.removeClickHandlerOnBlueMarketCards();
      this.topRightComponent.removeClickHandlerOnBlueMarketCards();

      //switch off all Market Icon colors since no one has any
      this.bottomLeftComponent.deactivateOrActivateIcons([false,false,false,false,false,false,false,false,false]);
      this.bottomRightComponent.deactivateOrActivateIcons([false,false,false,false,false,false,false,false,false]);
      this.topLeftComponent.deactivateOrActivateIcons([false,false,false,false,false,false,false,false,false]);
      this.topRightComponent.deactivateOrActivateIcons([false,false,false,false,false,false,false,false,false]);

      //switch off Quarry colors
      this.bottomLeftComponent.deactivateOrActivateStoneQuarry(false);
      this.bottomRightComponent.deactivateOrActivateStoneQuarry(false);
      this.topLeftComponent.deactivateOrActivateStoneQuarry(false);
      this.topRightComponent.deactivateOrActivateStoneQuarry(false);

      //switch off Sled colors
      this.bottomLeftComponent.deactivateOrActivateSupplySled(false);
      this.bottomRightComponent.deactivateOrActivateSupplySled(false);
      this.topLeftComponent.deactivateOrActivateSupplySled(false);
      this.topRightComponent.deactivateOrActivateSupplySled(false);

      //switch off your Score colors
      this.bottomLeftComponent.deactivateOrActivateScore(false);
      this.topLeftComponent.deactivateOrActivateScore(false);
      this.topRightComponent.deactivateOrActivateScore(false);
      this.bottomRightComponent.deactivateOrActivateScore(false);

      // switch off click handlers on market site
      this.marketComponent.removeClickHandlerOnMarketCards();

      // switch off click handlers on stones on all ship slots
      this.departingHarbourComponent.removeClickHandlerOnAllShips();

      // switch off click handlers on all stone quarries
      this.bottomLeftComponent.removeClickHandlerOnStoneQuarry();
      this.topLeftComponent.removeClickHandlerOnStoneQuarry();
      this.topRightComponent.removeClickHandlerOnStoneQuarry();
      this.bottomRightComponent.removeClickHandlerOnStoneQuarry();

    }

  }


  //=============================================================
  // Main Task 2:
  // Activate allowed interactions for active Player
  //=============================================================


  activateActivePlayerInteractions(
                                   amI_CurrentActivePlayer:boolean,
                                   currentActivePlayerField:ColourEnum){

    if (amI_CurrentActivePlayer) {

      //------------------------------------

      //ToDo:Set the flags below for:
      //ToDo:------------------------
      //ToDo:all player field opacity effects (hardcoded)
      //ToDo:deactivateOrActivateIcons(this.game.playerFieldIconsBlackAsBoolean.slice(3,11)...etc by updatePlayerData() and updateGameModel()); (hardcoded)
      //ToDo:
      //ToDo:Set the numbers / text below for:
      //ToDo:---------------------------------
      //ToDo:all player field numbers (updated in this.game.playerFieldIconsBlack...etc by updatePlayerData() and updateGameModel()) (hardcoded)
      //ToDo:all site information () (updated in
      //ToDo:
      //ToDo:Set/remove click handlers for:
      //ToDo:------------------------------
      //ToDo:Quarry
      //ToDo:
      //ToDo:Set/remove drag/drop handlers for:
      //ToDo:----------------------------------
      //ToDo:ships
      //ToDo:stones on ship
      //------------------------------------



      //TODO condense this into one function, NOT if-else
      //I am active player on black field
      //--------------------------------
      if(currentActivePlayerField===ColourEnum.black){

        //show my stone in sled, hide the others
        //BUT only if enough stones in sled
        this.bottomLeftComponent.showStone();
        this.topLeftComponent.hideStone();
        this.topRightComponent.hideStone();
        this.bottomRightComponent.hideStone();

        //let active player field glow, not the others
        this.bottomLeftComponent.playerFieldGlow(true);
        this.topLeftComponent.playerFieldGlow(false);
        this.topRightComponent.playerFieldGlow(false);
        this.bottomRightComponent.playerFieldGlow(false);

        //switch on click handlers on Blue Market Icons in own player field,
        // remove the others
        this.bottomLeftComponent.setClickHandlerOnBlueMarketCards();
        this.topLeftComponent.removeClickHandlerOnBlueMarketCards();
        this.topRightComponent.removeClickHandlerOnBlueMarketCards();
        this.bottomRightComponent.removeClickHandlerOnBlueMarketCards();

        //only switch on Market Icon colors with numbers in it
        //----------------------------------------------------

        if(this.game.playerFieldIconsBlack != null){
          if(1){console.log([0,1,2,3,4,5,6,7,8,9,10,11].slice(3,11));}
          console.log("test: ", this.game.playerFieldIconsBlack, this.game.playerFieldIconsBlackAsBoolean);
          this.bottomLeftComponent.deactivateOrActivateIcons(this.game.playerFieldIconsBlackAsBoolean.slice(3,11));
          this.bottomRightComponent.deactivateOrActivateIcons(this.game.playerFieldIconsWhiteAsBoolean.slice(3,11));
          this.topLeftComponent.deactivateOrActivateIcons(this.game.playerFieldIconsBrownAsBoolean.slice(3,11));
          this.topRightComponent.deactivateOrActivateIcons(this.game.playerFieldIconsGrayAsBoolean.slice(3,11));

        }
        //switch on your Quarry colors, switch off the others
        this.bottomLeftComponent.deactivateOrActivateStoneQuarry(true);
        this.topLeftComponent.deactivateOrActivateStoneQuarry(false);
        this.topRightComponent.deactivateOrActivateStoneQuarry(false);
        this.bottomRightComponent.deactivateOrActivateStoneQuarry(false);

        //switch on your Sled colors, switch off the others
        this.bottomLeftComponent.deactivateOrActivateSupplySled(true);
        this.topLeftComponent.deactivateOrActivateSupplySled(false);
        this.topRightComponent.deactivateOrActivateSupplySled(false);
        this.bottomRightComponent.deactivateOrActivateSupplySled(false);

        //switch on your Score colors, switch off the others
        this.bottomLeftComponent.deactivateOrActivateScore(true);
        this.topLeftComponent.deactivateOrActivateScore(false);
        this.topRightComponent.deactivateOrActivateScore(false);
        this.bottomRightComponent.deactivateOrActivateScore(false);

        // switch on click handlers on market site
        this.marketComponent.setClickHandlerOnMarketCards();

        // switch on click handlers on your stone quarry, switch off the others
        this.bottomLeftComponent.setClickHandlerOnStoneQuarry();
        this.topLeftComponent.removeClickHandlerOnStoneQuarry();
        this.topRightComponent.removeClickHandlerOnStoneQuarry();
        this.bottomRightComponent.removeClickHandlerOnStoneQuarry();


      }

      //I am active player on white field
      //--------------------------------
      else if(this.myPlayerField===ColourEnum.white){

        //show my stone in sled, hide the others
        //BUT only if enough stones in sled
        this.bottomLeftComponent.hideStone();
        this.topLeftComponent.showStone();
        this.topRightComponent.hideStone();
        this.bottomRightComponent.hideStone();

        //let active player field glow, not the others
        this.bottomLeftComponent.playerFieldGlow(false);
        this.topLeftComponent.playerFieldGlow(true);
        this.topRightComponent.playerFieldGlow(false);
        this.bottomRightComponent.playerFieldGlow(false);

        //switch on click handlers on Blue Market Icons in own player field
        this.bottomLeftComponent.removeClickHandlerOnBlueMarketCards();
        this.topLeftComponent.setClickHandlerOnBlueMarketCards();
        this.topRightComponent.removeClickHandlerOnBlueMarketCards();
        this.bottomRightComponent.removeClickHandlerOnBlueMarketCards();

        //only switch on Market Icon colors with numbers in it
        //----------------------------------------------------
        if(1){console.log([0,1,2,3,4,5,6,7,8,9,10,11].slice(3,11));}
        this.bottomLeftComponent.deactivateOrActivateIcons(this.game.playerFieldIconsBlackAsBoolean.slice(3,11));
        this.bottomRightComponent.deactivateOrActivateIcons(this.game.playerFieldIconsWhiteAsBoolean.slice(3,11));
        this.topLeftComponent.deactivateOrActivateIcons(this.game.playerFieldIconsBrownAsBoolean.slice(3,11));
        this.topRightComponent.deactivateOrActivateIcons(this.game.playerFieldIconsGrayAsBoolean.slice(3,11));

        //switch on your Quarry colors, switch off the others
        this.bottomLeftComponent.deactivateOrActivateStoneQuarry(false);
        this.topLeftComponent.deactivateOrActivateStoneQuarry(true);
        this.topRightComponent.deactivateOrActivateStoneQuarry(false);
        this.bottomRightComponent.deactivateOrActivateStoneQuarry(false);

        //switch on your Sled colors, switch off the others
        this.bottomLeftComponent.deactivateOrActivateSupplySled(false);
        this.topLeftComponent.deactivateOrActivateSupplySled(true);
        this.topRightComponent.deactivateOrActivateSupplySled(false);
        this.bottomRightComponent.deactivateOrActivateSupplySled(false);

        //switch on your Score colors, switch off the others
        this.bottomLeftComponent.deactivateOrActivateScore(false);
        this.topLeftComponent.deactivateOrActivateScore(true);
        this.topRightComponent.deactivateOrActivateScore(false);
        this.bottomRightComponent.deactivateOrActivateScore(false);

        // switch on click handlers on market site
        this.marketComponent.setClickHandlerOnMarketCards();

        // switch on click handlers on your stone quarry, switch off the others
        this.bottomLeftComponent.removeClickHandlerOnStoneQuarry();
        this.topLeftComponent.setClickHandlerOnStoneQuarry();
        this.topRightComponent.removeClickHandlerOnStoneQuarry();
        this.bottomRightComponent.removeClickHandlerOnStoneQuarry();


      }

      //I am active player on brown field
      //--------------------------------
      else if(this.myPlayerField===ColourEnum.brown){

        //show my stone in sled, hide the others
        //BUT only if enough stones in sled
        this.bottomLeftComponent.hideStone();
        this.topLeftComponent.hideStone();
        this.topRightComponent.showStone();
        this.bottomRightComponent.hideStone();

        //let active player field glow, not the others
        this.bottomLeftComponent.playerFieldGlow(false);
        this.topLeftComponent.playerFieldGlow(false);
        this.topRightComponent.playerFieldGlow(true);
        this.bottomRightComponent.playerFieldGlow(false);

        ///switch on click handlers on Blue Market Icons in own player field
        this.bottomLeftComponent.removeClickHandlerOnBlueMarketCards();
        this.topLeftComponent.removeClickHandlerOnBlueMarketCards();
        this.topRightComponent.setClickHandlerOnBlueMarketCards();
        this.bottomRightComponent.removeClickHandlerOnBlueMarketCards();

        //only switch on Market Icon colors with numbers in it
        //----------------------------------------------------
        if(1){console.log([0,1,2,3,4,5,6,7,8,9,10,11].slice(3,11));}
        this.bottomLeftComponent.deactivateOrActivateIcons(this.game.playerFieldIconsBlackAsBoolean.slice(3,11));
        this.bottomRightComponent.deactivateOrActivateIcons(this.game.playerFieldIconsWhiteAsBoolean.slice(3,11));
        this.topLeftComponent.deactivateOrActivateIcons(this.game.playerFieldIconsBrownAsBoolean.slice(3,11));
        this.topRightComponent.deactivateOrActivateIcons(this.game.playerFieldIconsGrayAsBoolean.slice(3,11));


        //switch on your Quarry colors, switch off the others
        this.bottomLeftComponent.deactivateOrActivateStoneQuarry(false);
        this.topLeftComponent.deactivateOrActivateStoneQuarry(false);
        this.topRightComponent.deactivateOrActivateStoneQuarry(true);
        this.bottomRightComponent.deactivateOrActivateStoneQuarry(false);

        //switch on your Sled colors, switch off the others
        this.bottomLeftComponent.deactivateOrActivateSupplySled(false);
        this.topLeftComponent.deactivateOrActivateSupplySled(false);
        this.topRightComponent.deactivateOrActivateSupplySled(true);
        this.bottomRightComponent.deactivateOrActivateSupplySled(false);

        //switch on your Score colors, switch off the others
        this.bottomLeftComponent.deactivateOrActivateScore(false);
        this.topLeftComponent.deactivateOrActivateScore(false);
        this.topRightComponent.deactivateOrActivateScore(true);
        this.bottomRightComponent.deactivateOrActivateScore(false);

        // switch on click handlers on market site
        this.marketComponent.setClickHandlerOnMarketCards();

        // switch on click handlers on your stone quarry, switch off the others
        this.bottomLeftComponent.removeClickHandlerOnStoneQuarry();
        this.topLeftComponent.removeClickHandlerOnStoneQuarry();
        this.topRightComponent.setClickHandlerOnStoneQuarry();
        this.bottomRightComponent.removeClickHandlerOnStoneQuarry();

      }

      //I am active player on gray field
      //-------------------------------
      if(this.myPlayerField===ColourEnum.gray){

        //show my stone in sled, hide the others
        //BUT only if enough stones in sled
        this.bottomLeftComponent.hideStone();
        this.topLeftComponent.hideStone();
        this.topRightComponent.hideStone();
        this.bottomRightComponent.showStone();


        //let active player field glow, not the others
        this.bottomLeftComponent.playerFieldGlow(false);
        this.topLeftComponent.playerFieldGlow(false);
        this.topRightComponent.playerFieldGlow(false);
        this.bottomRightComponent.playerFieldGlow(true);

        //switch on click handlers on Blue Market Icons in own player field
        this.bottomLeftComponent.removeClickHandlerOnBlueMarketCards();
        this.topLeftComponent.removeClickHandlerOnBlueMarketCards();
        this.topRightComponent.removeClickHandlerOnBlueMarketCards();
        this.bottomRightComponent.setClickHandlerOnBlueMarketCards();

        //only switch on Market Icon colors with numbers in it
        //----------------------------------------------------
        if(1){console.log([0,1,2,3,4,5,6,7,8,9,10,11].slice(3,11));}
        this.bottomLeftComponent.deactivateOrActivateIcons(this.game.playerFieldIconsBlackAsBoolean.slice(3,11));
        this.bottomRightComponent.deactivateOrActivateIcons(this.game.playerFieldIconsWhiteAsBoolean.slice(3,11));
        this.topLeftComponent.deactivateOrActivateIcons(this.game.playerFieldIconsBrownAsBoolean.slice(3,11));
        this.topRightComponent.deactivateOrActivateIcons(this.game.playerFieldIconsGrayAsBoolean.slice(3,11));

        //switch on your Quarry colors, switch off the others
        this.bottomLeftComponent.deactivateOrActivateStoneQuarry(false);
        this.topLeftComponent.deactivateOrActivateStoneQuarry(false);
        this.topRightComponent.deactivateOrActivateStoneQuarry(false);
        this.bottomRightComponent.deactivateOrActivateStoneQuarry(true);

        //switch on your Sled colors, switch off the others
        this.bottomLeftComponent.deactivateOrActivateSupplySled(false);
        this.topLeftComponent.deactivateOrActivateSupplySled(false);
        this.topRightComponent.deactivateOrActivateSupplySled(false);
        this.bottomRightComponent.deactivateOrActivateSupplySled(true);

        //switch on your Score colors, switch off the others
        this.bottomLeftComponent.deactivateOrActivateScore(false);
        this.topLeftComponent.deactivateOrActivateScore(false);
        this.topRightComponent.deactivateOrActivateScore(false);
        this.bottomRightComponent.deactivateOrActivateScore(true);

        // switch on click handlers on market site
        this.marketComponent.setClickHandlerOnMarketCards();

        // switch on click handlers on your stone quarry, switch off the others
        this.bottomLeftComponent.removeClickHandlerOnStoneQuarry();
        this.topLeftComponent.removeClickHandlerOnStoneQuarry();
        this.topRightComponent.removeClickHandlerOnStoneQuarry();
        this.bottomRightComponent.setClickHandlerOnStoneQuarry();

      }

    }
    //TODO cleanup/condense until here
  }


  //===========================================================
  // Main Action 1: take stones from Quarry to Sled
  //===========================================================


  //received data from child components
  //-----------------------------------

  bottomLeftComponent_onEvent_setClickHandlerOnStoneQuarry_sledStones(data:number){
    this.bottomLeftComponent.sledStones=data;
    this.takeStonesFromQuarryToSled(ColourEnum.black);
  }
  bottomLeftComponent_onEvent_setClickHandlerOnStoneQuarry_quarryStones(data:number){
    this.bottomLeftComponent.quarryStones=data;
  }


  topLeftComponent_onEvent_setClickHandlerOnStoneQuarry_sledStones(data:number){
    this.topLeftComponent.sledStones=data;
    this.takeStonesFromQuarryToSled(ColourEnum.white);
  }
  topLeftComponent_onEvent_setClickHandlerOnStoneQuarry_quarryStones(data:number){
    this.topLeftComponent.quarryStones=data;
  }


  topRightComponent_onEvent_setClickHandlerOnStoneQuarry_sledStones(data:number){
    this.topRightComponent.sledStones=data;
    this.takeStonesFromQuarryToSled(ColourEnum.brown);
  }
  topRightComponent_onEvent_setClickHandlerOnStoneQuarry_quarryStones(data:number){
    this.topRightComponent.quarryStones=data;
  }


  bottomRightComponent_onEvent_setClickHandlerOnStoneQuarry_sledStones(data:number){
    this.bottomRightComponent.sledStones=data;
    this.takeStonesFromQuarryToSled(ColourEnum.gray);
  }
  bottomRightComponent_onEvent_setClickHandlerOnStoneQuarry_quarryStones(data:number){
    this.bottomRightComponent.quarryStones=data;
  }


  takeStonesFromQuarryToSled(playerField:ColourEnum){

    //called from click event in player field components
    if(1){console.log("take stones from Quarry to Sled");}

    //make calculations
    let stonesInQuarry:number;
    let stonesInSled:number;
    let stonesToTake:number;


    console.log('This player takes stones from Quarry:', playerField);

      stonesInQuarry=this.colourMap[playerField].quarryStones;
      stonesInSled=this.colourMap[playerField].sledStones;

      if(stonesInSled < 5){
        if(stonesInSled < 3){
          stonesToTake = Math.min(stonesInQuarry, 3);
        }
        else{
          stonesToTake = Math.min(stonesInQuarry, 5-stonesInSled);
        }


        //TODO these are not needed, get data from backend
        //this.colourMap[playerField].quarryStones -= stonesToTake;
        //this.colourMap[playerField].sledStones += stonesToTake;
        console.log("locally taking stones: ", stonesToTake);

      }
      else{
        this.showSnackbarMessage("You can't take any stones because your sled is full.")
        return;
      }


    //send move object to backend
    let moveToSend = new Move(PositionEnum.Quarry, PositionEnum.Sled, stonesToTake);
    this.gameService.sendMove(moveToSend); //Send move to backend


    //snackbar message
    this.showSnackbarMessage("You took "+ stonesToTake+" stones from the quarry.");


    if(1){console.log("take stones from Quarry to Sled:stonesToTake ",stonesToTake);}

    if(1){console.log("take stones from Quarry to Sled:Component.quarryStones ",this.bottomLeftComponent.quarryStones);}
    if(1){console.log("take stones from Quarry to Sled:Component.sledStones ",this.bottomLeftComponent.sledStones);}

  }

  //received data from child components
  //-----------------------------------

  templeComponent_onEvent_placeStones_stones(data:Stone[]){
    this.templeComponent.stones=data;
  };

  templeComponent_onEvent_placeStones_totalStones(data:number){
    this.templeComponent.totalStones=data;
  };

  templeComponent_onEvent_placeStones_fieldHeight(data:number[]){
    this.templeComponent.fieldHeight=data;
  };


  //received data from child components
  //-----------------------------------

  obeliskComponent_onEvent_placeStones_stones(data:number[]){

    console.log("data from obeliskComponent",data);

    //store data into Game Model
    this.obeliskComponent.stones=data;

    console.log("data from Game Model",this.obeliskComponent.stones);

  };


  //===========================================================
  // Main Action 4: take market card
  //===========================================================

  //received data from child components
  //-----------------------------------

  marketComponent_onEvent_setClickHandlerOnMarketCards_1_marketCards(data:MarketCard[]) {
    if (1) {
      console.log("marketCards 1: data: ", data);
    }
    if (data[0] != null) {
      console.log("card exists.", data[0]);
      if (data[0].type == "Red") {
        this.takeRedMarketCardFromMarket(data[0], 1);
      }
      else {
        this.takeNotRedMarketCardFromMarket(data[0], 1);
      }
    }
  }

  marketComponent_onEvent_setClickHandlerOnMarketCards_2_marketCards(data:MarketCard[]){
    if(1){console.log("marketCards 2: data: ",data);}
    if (data[1] != null) {
      if (data[1].type == "Red") {
        this.takeRedMarketCardFromMarket(data[1], 2);
      }
      else {
        this.takeNotRedMarketCardFromMarket(data[1], 2);
      }
    }
  }
  marketComponent_onEvent_setClickHandlerOnMarketCards_3_marketCards(data:MarketCard[]){
    if(1){console.log("marketCards 3: data: ",data);}
    if (data[2] != null) {
      if (data[2].type == "Red") {
        this.takeRedMarketCardFromMarket(data[2], 3);
      }
      else {
        this.takeNotRedMarketCardFromMarket(data[2], 3);
      }
    }
  }
  marketComponent_onEvent_setClickHandlerOnMarketCards_4_marketCards(data:MarketCard[]){
    if(1){console.log("marketCards 4: data: ",data);}
    if (data[3] != null) {
      if (data[3].type == "Red") {
        this.takeRedMarketCardFromMarket(data[3], 4);
      }
      else {
        this.takeNotRedMarketCardFromMarket(data[3], 4);
      }
    }
  }

  //================
  // Main Action 4a: take red market card
  //================

  takeRedMarketCardFromMarket(marketCard:MarketCard, marketCardSlot){

    //called from click event in market component
    if(1){console.log("take red market card from market", marketCard, marketCardSlot);}

    //determine which specific market card (id) was taken
    //according to our market card model
    //---------------------------------------------------
    let marketCardId=marketCard.id;
    let marketCardName:string;
    let place:string;
    let additionalDataSent:number[];

    //choose player field
    // change numbers in quarry
    //-------------------------
    let stonesInQuarry:number;
    let playerField=this.game.currentActivePlayerField;
    let howMany:number=0;



    //bottom left
    //-----------
    if(playerField===ColourEnum.black){
      stonesInQuarry=this.bottomLeftComponent.quarryStones;

      if(stonesInQuarry>=1){
        howMany=1;

        //paved path (one stone from quarry to obelisk)
        if (marketCardId==1 || marketCardId==2){
          marketCardName="paved path";
          place="obelisk";

          //place one black stone on obelisk board
          let stoneId=99999;//unknown
          let stoneColour=ColourEnum.black;
          let newStone=new Stone(stoneId,stoneColour);
          this.obeliskComponent.placeStones([newStone,null,null,null]);

          //update game model

          //for other clients
          additionalDataSent=this.obeliskComponent.stones;


        }

        //sarcophargus (one stone from quarry to burial chamber)
        else if (marketCardId==3 || marketCardId==4){
          marketCardName="sarcophargus";
          place="burial chamber";

          //place one black stone on burial chamber board
          let stoneId=99999;//unknown
          let stoneColour=ColourEnum.black;
          let newStone=new Stone(stoneId,stoneColour);
          this.burialChamberComponent.placeStones([newStone,null,null,null]);

        }

        //entrance (one stone from quarry to pyramid)
        else if (marketCardId==5 || marketCardId==6){
          marketCardName="entrance";
          place="pyramid";


          //place one black stone on pyramid board
          let stoneId=99999;//unknown
          let stoneColour=ColourEnum.black;
          let newStone=new Stone(stoneId,stoneColour);
          this.pyramidComponent.placeStones([newStone,null,null,null]);

        }

      }
      else{
        this.showSnackbarMessage("you can not take stones from the quarry")
        return;
      }

      //change numbers
      this.bottomLeftComponent.quarryStones-=howMany;

    }

    //top left
    //--------
    else if(playerField===ColourEnum.white){
      stonesInQuarry=this.topLeftComponent.quarryStones;

      if(stonesInQuarry>=1){
        howMany=1;

        //paved path (one stone from quarry to obelisk)
        if (marketCardId==1 || marketCardId==2){
          marketCardName="paved path";
          place="obelisk";

          //place one white stone on obelisk board
          let stoneId=99999; //unknown
          let stoneColour=ColourEnum.white;
          let newStone=new Stone(stoneId,stoneColour);
          this.obeliskComponent.placeStones([null,newStone,null,null]);

          //update game model
          this.obeliskComponent.stones[1]+=1;

          //for other clients
          additionalDataSent=this.obeliskComponent.stones;

        }

        //sarcophargus (one stone from quarry to burial chamber)
        else if (marketCardId==3 || marketCardId==4){
          marketCardName="sarcophargus";
          place="burial chamber";


          //place one white stone on burial chamber board
          let stoneId=99999;//unknown
          let stoneColour=ColourEnum.white;
          let newStone=new Stone(stoneId,stoneColour);
          this.burialChamberComponent.placeStones([null,newStone,null,null]);

        }

        //entrance (one stone from quarry to pyramid)
        else if (marketCardId==5 || marketCardId==6){
          marketCardName="entrance";
          place="pyramid";

          //place one white stone on pyramid board
          let stoneId=99999;//unknown
          let stoneColour=ColourEnum.white;
          let newStone=new Stone(stoneId,stoneColour);
          this.pyramidComponent.placeStones([null,newStone,null,null]);
        }


      }
      else{
        this.showSnackbarMessage("you can not take stones from the quarry")
        return;
      }

      //change numbers
      this.topLeftComponent.quarryStones-=howMany;

    }

    //top right
    //---------
    else if(playerField===ColourEnum.brown){
      stonesInQuarry=this.topRightComponent.quarryStones;

      if(stonesInQuarry>=1){
        howMany=1;

        //paved path (one stone from quarry to obelisk)
        if (marketCardId==1 || marketCardId==2){
          marketCardName="paved path";
          place="obelisk";

          //place one brown stone on obelisk board
          let stoneId=99999;//unknown
          let stoneColour=ColourEnum.brown;
          let newStone=new Stone(stoneId,stoneColour);
          this.obeliskComponent.placeStones([null,null,newStone,null]);

          //update game model
          this.obeliskComponent[2]+=1;

          //for other clients
          additionalDataSent=this.obeliskComponent.stones;

        }

        //sarcophargus (one stone from quarry to burial chamber)
        else if (marketCardId==3 || marketCardId==4){
          marketCardName="sarcophargus";
          place="burial chamber";


          //place one brown stone on burial chamber board
          let stoneId=99999;//unknown
          let stoneColour=ColourEnum.brown;
          let newStone=new Stone(stoneId,stoneColour);
          this.burialChamberComponent.placeStones([null,null,newStone,null]);
        }

        //entrance (one stone from quarry to pyramid)
        else if (marketCardId==5 || marketCardId==6){
          marketCardName="entrance";
          place="pyramid";

          //place one brown stone on pyramid board
          let stoneId=99999;//unknown
          let stoneColour=ColourEnum.brown;
          let newStone=new Stone(stoneId,stoneColour);
          this.pyramidComponent.placeStones([null,null,newStone,null]);
        }

      }
      else{
        this.showSnackbarMessage("you can not take stones from the quarry");
        return;
      }

      //change numbers
      this.topRightComponent.quarryStones-=howMany;

    }

    //bottom right
    //------------
    else if(playerField===ColourEnum.gray){
      stonesInQuarry=this.bottomRightComponent.quarryStones;

      if(stonesInQuarry>=1){
        howMany=1;

        //paved path (one stone from quarry to obelisk)
        if (marketCardId==1 || marketCardId==2){
          marketCardName="paved path";
          place="obelisk";

          //place one gray stone on obelisk board
          let stoneId=99999;//unknown
          let stoneColour=ColourEnum.gray;
          let newStone=new Stone(stoneId,stoneColour);
          this.obeliskComponent.placeStones([null,null,null,newStone]);

          //update game model
          this.obeliskComponent.stones[3]+=1;

          //for other clients
          additionalDataSent=this.obeliskComponent.stones;

        }

        //sarcophargus (one stone from quarry to burial chamber)
        else if (marketCardId==3 || marketCardId==4){
          marketCardName="sarcophargus";
          place="burial chamber";


          //place one gray stone on burial chamber board
          let stoneId=99999;//unknown
          let stoneColour=ColourEnum.gray;
          let newStone=new Stone(stoneId,stoneColour);
          this.burialChamberComponent.placeStones([null,null,null,newStone]);

        }

        //entrance (one stone from quarry to pyramid)
        else if (marketCardId==5 || marketCardId==6){
          marketCardName="entrance";
          place="pyramid";

          //place one gray stone on burial pyramid
          let stoneId=99999;//unknown
          let stoneColour=ColourEnum.gray;
          let newStone=new Stone(stoneId,stoneColour);
          this.pyramidComponent.placeStones([null,null,null,newStone]);

        }

      }
      else{
        this.showSnackbarMessage("you can not take stones from the quarry");
        return;
      }

      //change numbers
      this.bottomRightComponent.quarryStones-=howMany;

    }


    //delete market card from slot on market board
    //--------------------------------------------
    if (marketCardSlot==1){
      this.marketComponent.chooseMarketCard_1_OnClick()
    }
    else if (marketCardSlot==2){
      this.marketComponent.chooseMarketCard_2_OnClick()
    }
    else if (marketCardSlot==3){
      this.marketComponent.chooseMarketCard_3_OnClick()
    }
    else if (marketCardSlot==4){
      this.marketComponent.chooseMarketCard_4_OnClick()
    }


    //generate move object to send to backend
    //----------------------------------------
    let snackbarMsg= this.game.myUserName+ " picked red market card "+ marketCardName +" and placed "+ howMany +
      " stone(s) from quarry to " + place + ".";

    //send to backend
    let moveToSend = new Move(PositionEnum.Market, PositionEnum.PlayerCardStack, marketCardId);
    this.gameService.sendMove(moveToSend); //Send move to backend


    //snackbar message
    this.showSnackbarMessage("You picked red market card "+ marketCardName +" and placed "+ howMany +
      " stone(s) from quarry to " + place + " .");

  }

  //================
  // Main Action 4a: take NOT red market card
  //================


  takeNotRedMarketCardFromMarket(marketCard:MarketCard, marketCardSlot:number){

    //called from click event in market component
    if(1){console.log("take NOT red market card from market");}


    //determine which specific market card (id) was taken
    //according to our market card model
    //---------------------------------------------------
    let marketCardId=marketCard.id;
    let marketCardName=marketCard.name;

    //choose player field
    // change numbers in market icons
    //-------------------------------
    let playerField=this.game.currentActivePlayerField;


    //add card to player field icons
    //------------------------------
    if (marketCardId==7 || marketCardId==8){//pyramid
      this.updateGameModelPlayerData_increaseByNumber([0,0,0,0,1,0,0,0,0,0,0,0], playerField);
      this.updatePlayerDataWithArray_increaseByNumber([0,0,0,0,1,0,0,0,0,0,0,0], playerField);
      if(playerField===ColourEnum.black){
        this.bottomLeftComponent.deactivateOrActivateIcons_onChange([,"true",,,,,,,]);
      }
      if(playerField===ColourEnum.white){
        this.topLeftComponent.deactivateOrActivateIcons_onChange([,"true",,,,,,,]);
      }
      if(playerField===ColourEnum.brown){
        this.topRightComponent.deactivateOrActivateIcons_onChange([,"true",,,,,,,]);
      }
      if(playerField===ColourEnum.gray){
        this.bottomRightComponent.deactivateOrActivateIcons_onChange([,"true",,,,,,,]);
      }

    }
    if (marketCardId==9 || marketCardId==10){//temple
      this.updateGameModelPlayerData_increaseByNumber([0,0,0,0,0,1,0,0,0,0,0,0], playerField);
      this.updatePlayerDataWithArray_increaseByNumber([0,0,0,0,0,1,0,0,0,0,0,0], playerField);
      if(playerField===ColourEnum.black){
        this.bottomLeftComponent.deactivateOrActivateIcons_onChange([,,"true",,,,,,]);
      }
      if(playerField===ColourEnum.white){
        this.topLeftComponent.deactivateOrActivateIcons_onChange([,,"true",,,,,,]);
      }
      if(playerField===ColourEnum.brown){
        this.topRightComponent.deactivateOrActivateIcons_onChange([,,"true",,,,,,]);
      }
      if(playerField===ColourEnum.gray){
        this.bottomRightComponent.deactivateOrActivateIcons_onChange([,,"true",,,,,,]);
      }
    }
    if (marketCardId==11 || marketCardId==12){//burial chamber
      this.updateGameModelPlayerData_increaseByNumber([0,0,0,0,0,0,1,0,0,0,0,0], playerField);
      this.updatePlayerDataWithArray_increaseByNumber([0,0,0,0,0,0,1,0,0,0,0,0], playerField);
      if(playerField===ColourEnum.black){
        this.bottomLeftComponent.deactivateOrActivateIcons_onChange([,,,"true",,,,,]);
      }
      if(playerField===ColourEnum.white){
        this.topLeftComponent.deactivateOrActivateIcons_onChange([,,,"true",,,,,]);
      }
      if(playerField===ColourEnum.brown){
        this.topRightComponent.deactivateOrActivateIcons_onChange([,,,"true",,,,,]);
      }
      if(playerField===ColourEnum.gray){
        this.bottomRightComponent.deactivateOrActivateIcons_onChange([,,,"true",,,,,]);
      }
    }
    if (marketCardId==13 || marketCardId==14){//obelisk
      this.updateGameModelPlayerData_increaseByNumber([0,0,0,0,0,0,0,1,0,0,0,0], playerField);
      this.updatePlayerDataWithArray_increaseByNumber([0,0,0,0,0,0,0,1,0,0,0,0], playerField);
      if(playerField===ColourEnum.black){
        this.bottomLeftComponent.deactivateOrActivateIcons_onChange([,,,,"true",,,,]);
      }
      if(playerField===ColourEnum.white){
        this.topLeftComponent.deactivateOrActivateIcons_onChange([,,,,"true",,,,]);
      }
      if(playerField===ColourEnum.brown){
        this.topRightComponent.deactivateOrActivateIcons_onChange([,,,,"true",,,,]);
      }
      if(playerField===ColourEnum.gray){
        this.bottomRightComponent.deactivateOrActivateIcons_onChange([,,,,"true",,,,]);
      }
    }
    if (marketCardId>=15 && marketCardId<=24){//statues
      this.updateGameModelPlayerData_increaseByNumber([0,0,0,1,0,0,0,0,0,0,0,0], playerField);
      this.updatePlayerDataWithArray_increaseByNumber([0,0,0,1,0,0,0,0,0,0,0,0], playerField);
      if(playerField===ColourEnum.black){
        this.bottomLeftComponent.deactivateOrActivateIcons_onChange(["true",,,,,,,,]);
      }
      if(playerField===ColourEnum.white){
        this.topLeftComponent.deactivateOrActivateIcons_onChange(["true",,,,,,,,]);
      }
      if(playerField===ColourEnum.brown){
        this.topRightComponent.deactivateOrActivateIcons_onChange(["true",,,,,,,,]);
      }
      if(playerField===ColourEnum.gray){
        this.bottomRightComponent.deactivateOrActivateIcons_onChange(["true",,,,,,,,]);
      }
    }
    if (marketCardId==25 || marketCardId==26 || marketCardId==27){//chisel
      this.updateGameModelPlayerData_increaseByNumber([0,0,0,0,0,0,0,0,1,0,0,0], playerField);
      this.updatePlayerDataWithArray_increaseByNumber([0,0,0,0,0,0,0,0,1,0,0,0], playerField);
      if(playerField===ColourEnum.black){
        this.bottomLeftComponent.deactivateOrActivateIcons_onChange([,,,,,"true",,,]);
      }
      if(playerField===ColourEnum.white){
        this.topLeftComponent.deactivateOrActivateIcons_onChange([,,,,,"true",,,]);
      }
      if(playerField===ColourEnum.brown){
        this.topRightComponent.deactivateOrActivateIcons_onChange([,,,,,"true",,,]);
      }
      if(playerField===ColourEnum.gray){
        this.bottomRightComponent.deactivateOrActivateIcons_onChange([,,,,,"true",,,]);
      }
    }
    if (marketCardId==30 || marketCardId==31){//hammer
      this.updateGameModelPlayerData_increaseByNumber([0,0,0,0,0,0,0,0,0,1,0,0], playerField);
      this.updatePlayerDataWithArray_increaseByNumber([0,0,0,0,0,0,0,0,0,1,0,0], playerField);
      if(playerField===ColourEnum.black){
        this.bottomLeftComponent.deactivateOrActivateIcons_onChange([,,,,,,"true",,]);
      }
      if(playerField===ColourEnum.white){
        this.topLeftComponent.deactivateOrActivateIcons_onChange([,,,,,,"true",,]);
      }
      if(playerField===ColourEnum.brown){
        this.topRightComponent.deactivateOrActivateIcons_onChange([,,,,,,"true",,]);
      }
      if(playerField===ColourEnum.gray){
        this.bottomRightComponent.deactivateOrActivateIcons_onChange([,,,,,,"true",,]);
      }
    }
    if (marketCardId==28 || marketCardId==29){//lever
      this.updateGameModelPlayerData_increaseByNumber([0,0,0,0,0,0,0,0,0,0,0,1], playerField);
      this.updatePlayerDataWithArray_increaseByNumber([0,0,0,0,0,0,0,0,0,0,0,1], playerField);
      if(playerField===ColourEnum.black){
        this.bottomLeftComponent.deactivateOrActivateIcons_onChange([,,,,,,,,"true"]);
      }
      if(playerField===ColourEnum.white){
        this.topLeftComponent.deactivateOrActivateIcons_onChange([,,,,,,,,"true"]);
      }
      if(playerField===ColourEnum.brown){
        this.topRightComponent.deactivateOrActivateIcons_onChange([,,,,,,,,"true"]);
      }
      if(playerField===ColourEnum.gray){
        this.bottomRightComponent.deactivateOrActivateIcons_onChange([,,,,,,,,"true"]);
      }
    }
    if (marketCardId==32 || marketCardId==33 || marketCardId==34){//sail
      this.updateGameModelPlayerData_increaseByNumber([0,0,0,0,0,0,0,0,0,0,1,0], playerField);
      this.updatePlayerDataWithArray_increaseByNumber([0,0,0,0,0,0,0,0,0,0,1,0], playerField);
      if(playerField===ColourEnum.black){
        this.bottomLeftComponent.deactivateOrActivateIcons_onChange([,,,,,,,"true",]);
      }
      if(playerField===ColourEnum.white){
        this.topLeftComponent.deactivateOrActivateIcons_onChange([,,,,,,,"true",]);
      }
      if(playerField===ColourEnum.brown){
        this.topRightComponent.deactivateOrActivateIcons_onChange([,,,,,,,"true",]);
      }
      if(playerField===ColourEnum.gray){
        this.bottomRightComponent.deactivateOrActivateIcons_onChange([,,,,,,,"true",]);
      }
    }


    //delete market card from slot on market board
    //--------------------------------------------
    if (marketCardSlot==1){
      this.marketComponent.chooseMarketCard_1_OnClick()
    }
    else if (marketCardSlot==2){
      this.marketComponent.chooseMarketCard_2_OnClick()
    }
    else if (marketCardSlot==3){
      this.marketComponent.chooseMarketCard_3_OnClick()
    }
    else if (marketCardSlot==4){
      this.marketComponent.chooseMarketCard_4_OnClick()
    }

    //generate move object to send to backend
    //----------------------------------------

    let snackbarMsg =this.game.myUserName+ " picked market card "+ marketCardName + ".";


    //send to backend
    let moveToSend = new Move(PositionEnum.Market, PositionEnum.PlayerCardStack, marketCardId);
    this.gameService.sendMove(moveToSend); //Send move to backend

    //snackbar message
    this.showSnackbarMessage("You picked market card " + marketCardName + " .");

  }



  //===========================================================
  // Main Action 5: play blue market card
  //===========================================================

  //received data from child components
  //-----------------------------------

  bottomLeftComponent_onEvent_setClickHandlerOnBlueMarketCards_bll_1_marketCards(data:number[]){
    this.bottomLeftComponent.marketCards=data;
  }
  bottomLeftComponent_onEvent_setClickHandlerOnBlueMarketCards_bml_1_marketCards(data:number[]){
    this.bottomLeftComponent.marketCards=data;
  }
  bottomLeftComponent_onEvent_setClickHandlerOnBlueMarketCards_bmr_1_marketCards(data:number[]){
    this.bottomLeftComponent.marketCards=data;
  }
  bottomLeftComponent_onEvent_setClickHandlerOnBlueMarketCards_brr_1_marketCards(data:number[]){
    this.bottomLeftComponent.marketCards=data;
  }


  topLeftComponent_onEvent_setClickHandlerOnBlueMarketCards_bll_2_marketCards(data:number[]){
    this.topLeftComponent.marketCards=data;
  }
  topLeftComponent_onEvent_setClickHandlerOnBlueMarketCards_bml_2_marketCards(data:number[]){
    this.topLeftComponent.marketCards=data;
  }
  topLeftComponent_onEvent_setClickHandlerOnBlueMarketCards_bmr_2_marketCards(data:number[]){
    this.topLeftComponent.marketCards=data;
  }
  topLeftComponent_onEvent_setClickHandlerOnBlueMarketCards_brr_2_marketCards(data:number[]){
    this.topLeftComponent.marketCards=data;
  }


  topRightComponent_onEvent_setClickHandlerOnBlueMarketCards_bll_3_marketCards(data:number[]){
    this.topRightComponent.marketCards=data;
  }
  topRightComponent_onEvent_setClickHandlerOnBlueMarketCards_bml_3_marketCards(data:number[]){
    this.topRightComponent.marketCards=data;
  }
  topRightComponent_onEvent_setClickHandlerOnBlueMarketCards_bmr_3_marketCards(data:number[]){
    this.topRightComponent.marketCards=data;
  }
  topRightComponent_onEvent_setClickHandlerOnBlueMarketCards_brr_3_marketCards(data:number[]){
    this.topRightComponent.marketCards=data;
  }


  bottomRightComponent_onEvent_setClickHandlerOnBlueMarketCards_bll_4_marketCards(data:number[]){
    this.bottomRightComponent.marketCards=data;
  }
  bottomRightComponent_onEvent_setClickHandlerOnBlueMarketCards_bml_4_marketCards(data:number[]){
    this.bottomRightComponent.marketCards=data;
  }
  bottomRightComponent_onEvent_setClickHandlerOnBlueMarketCards_bmr_4_marketCards(data:number[]){
    this.bottomRightComponent.marketCards=data;
  }
  bottomRightComponent_onEvent_setClickHandlerOnBlueMarketCards_brr_4_marketCards(data:number[]){
    this.bottomRightComponent.marketCards=data;
  }


  playBlueMarketCardHammer(){

    //listen to click on market card icon

    //show market card icon in snackbar

    //make move 1

    //generate decision object

    //make move 2

    //generate decision object

    //send decision object to backend
    //ToDo: Communication Channel to Backend
    //ToDo: send decision object to backend


  }

  playBlueMarketCardChisel(){

    //listen to click on market card icon

    //show market card icon in snackbar

    //make move 1

    //generate decision object

    //make move 2

    //generate decision object

    //send decision object to backend
    //ToDo: Communication Channel to Backend
    //ToDo: send move object to backend



  }

  playBlueMarketCardSail(){

    //listen to click on market card icon

    //show market card icon in snackbar

    //make move 1

    //generate decision object

    //make move 2

    //generate decision object

    //send decision object to backend
    //ToDo: Communication Channel to Backend
    //ToDo: send move object to backend



  }

  playBlueMarketCardLever(){

    //listen to click on market card icon

    //show market card icon in snackbar

    //make move 1 (sail ship)

    //generate decision object

    //make move 2 (new stone order)
    let ship:number=0;
    this.departingHarbourComponent.setClickHandlerOnStonesOnShip(ship);

    //generate decision object

    //send decision object to backend
    //ToDo: Communication Channel to Backend
    //ToDo: send move object to backend

  }



  //===========================================
  // Enable Communication with Child Components
  //===========================================

  // Enable communication with PlayerComponent
  @ViewChild(PlayerComponent) playerComponent:PlayerComponent;

  // Enable communication with active player component BottomLeftComponent
  @ViewChild(BottomLeftComponent) bottomLeftComponent:BottomLeftComponent;

  // Enable communication with not active player component BottomLeftComponent
  @ViewChild(TopLeftComponent) topLeftComponent:TopLeftComponent;

  // Enable communication with not active player component BottomLeftComponent
  @ViewChild(TopRightComponent) topRightComponent:TopRightComponent;

  // Enable communication with not active player component BottomLeftComponent
  @ViewChild(BottomRightComponent) bottomRightComponent:BottomRightComponent;


  // Enable communication with ShipComponent
  @ViewChild(ShipComponent) shipComponent:ShipComponent;

  // Enable communication with InfoBoxComponent
  @ViewChild(InfoBoxComponent) infoBoxComponent:InfoBoxComponent;

  // Enable communication with StoneComponent
  @ViewChild(StoneComponent) stoneComponent:StoneComponent;

}
