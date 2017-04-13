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
import {MarketHarbourComponent} from "./market-harbour/market-harbour.component";
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

import {UserService} from "../shared/services/user.service";

import {ActivatedRoute} from "@angular/router";
import {Round} from "../shared/models/round";


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

  // my username entered in login screen
  // get username from userService
  myUserName:string=this.userService.mySelf().username;

  // am I the current active player
  amI_CurrentActivePlayer;

  // my player field (bottom-left, top-left, top-right, bottom-right)
  myPlayerField;

  // player field of current active player
  currentActivePlayerField;


  // Current Target (Soll) Game state
  // ( current-game-state package from backend sent to all players)
  currentTargetGameState:CurrentGameState;

  // Current Actual (Ist) Game state
  // ( current-game-state package from backend sent to all players)
  currentActualGameState:CurrentGameState;

  // Last players move/action/decision
  // ( decision package from backend sent to not active players)
  lastPlayerDecision:Decision;

  // Current active Player
  currentActivePlayer:User;

  // Allowed moves/actions/decisions
  // ( decision package from backend sent to active player, (to not active players as info))
  allowedActivePlayerDecisions:Decision;

  // Active player move/action/decision
  // (decision package from active player sent to backend)
  chosenActivePlayerDecision:Decision;


  //===============
  //Constructor
  //===============
  constructor(private dragulaService: DragulaService,
              private gameService: GameService,
              private userService: UserService,
              private route: ActivatedRoute,
              private _ngZone: NgZone) {

    //dragula subscriptions
    this.dragula_subscribeDragEvent();
    this.dragula_subscribeDropEvent();

    //snackbar div in game footer
    this.generateSnackbarDiv();

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

  //used in dragula drop
  playedBlueMarketCard_lever=false;


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


  //Fake market cards
  marketCard1 = new MarketCard(1);
  marketCard2 = new MarketCard(2);
  marketCard3 = new MarketCard(3);
  marketCard4 = new MarketCard(4);

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

    // (+) converts string 'id' to a number
    let id = +this.route.snapshot.params['id'];

    // if the game component is loaded without an :id parameter in the url (the original state,
    // we continue with the "old fake game"
    // otherwise load the real "fake" game from the backend
    if(!isNaN(id)) {

      this.gameService.getGame(id)
        .subscribe((game: Game) => {
          this.game = game;
          console.log("Initializing game with id: ", id, game);

          // Now we need to connect via websockets and listen for gamestate updates

        });
    }

    //Initialize the new game
    this.initializeNewGame(this.getFakeGame());


  }


  //===========================================================
  // Backend starts new game
  //===========================================================

  //Fake Game
  getFakeGame(){

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

    //fill fake market cards array
    this.marketCards.push(this.marketCard1);
    this.marketCards.push(this.marketCard2);
    this.marketCards.push(this.marketCard3);
    this.marketCards.push(this.marketCard4);

    //fill fake player array
    this.players_target.push(this.player1,);
    this.players_target.push(this.player2,);
    this.players_target.push(this.player3,);
    this.players_target.push(this.player4,);

    //Fake current active player field
    this.currentActivePlayerField=ColourEnum.black;



    let returnGame = new Game(0, 'token',
      'name', 4,  this.players_target,
      1, this.ships_target, this.marketCards,
      this.currentActivePlayerField, null);
    return returnGame;
  }


  //===========================================================
  // Initialize the new game:
  // All components, mySelf (either active or inactive player)
  //===========================================================

  initializeNewGame(game_backend:Game){

    //set class variable
    this.game = game_backend;

    //Site Board Components: the island
    this.initializeMarketComponent(game_backend.marketCards);
    this.initializeObeliskComponent();
    this.initializePyramidComponent();
    this.initializeTempleComponent();
    this.initializeBurialChamberComponent();

    //Departing Harbour: the ships
    this.initializeDepartingHarbourComponent(game_backend.ships);

    //Player Component: the four player fields (what everyone concerns)
    this.initializePlayerComponents(game_backend.players, game_backend.numPlayers);

    //Determine which player field you have (sets class variable)
    let myPlayerField:ColourEnum;
    myPlayerField=this.determineWhichPlayerFieldYouHave(
      game_backend.players,
      game_backend.numPlayers);

    //Determine whether you are the active player (set class variable)
    let amI_CurrentActivePlayer=game_backend.currentActivePlayerField===myPlayerField;
    this.amI_CurrentActivePlayer=amI_CurrentActivePlayer;

    //Read current active player field (set class variable)
    let currentActivePlayerField=game_backend.currentActivePlayerField;
    this.currentActivePlayerField=currentActivePlayerField;

    //Initialize Myself
    //(depends on whether you are the active or inactive player)
    this.initializeMySelf(amI_CurrentActivePlayer, currentActivePlayerField);

    // set Dragula Options (Depending on whether you are the active or inactive player)
    //---------------------------------------------------------------------------------
    this.dragulaShipMovement_setOptions(amI_CurrentActivePlayer);
    this.dragulaStoneMovement_setOptions(amI_CurrentActivePlayer);

  }

  // Init Sites
  //-----------
  initializeMarketComponent(marketCards:MarketCard[]){
    this.marketComponent.removeUnusedMarketCards();
    this.marketComponent.generateFourMarketCards(marketCards);
    //do not set click handlers here
  }

  initializeObeliskComponent(){
    let obelisk:Obelisk; //ToDo: What for?
    this.obeliskComponent.setAttributes(this.game.numPlayers);
    this.obeliskComponent.removeStones();
  }

  initializePyramidComponent(){
    let pyramid:Pyramid;//ToDo: What for?
    this.pyramidComponent.removeStones();
  }

  initializeTempleComponent(){
    let temple:Temple;//ToDo: What for?
    this.templeComponent.setAttributes(this.game.numPlayers);
    this.templeComponent.removeStones();
  }

  initializeBurialChamberComponent(){
    let burialChamber:BurialChamber;//ToDo: What for?
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

        // switch on click handlers on market site
        this.marketComponent.setClickHandlerOnMarketCards();

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

        // switch on click handlers on market site
        this.marketComponent.setClickHandlerOnMarketCards();

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

        // switch on click handlers on market site
        this.marketComponent.setClickHandlerOnMarketCards();

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

        // switch on click handlers on market site
        this.marketComponent.setClickHandlerOnMarketCards();

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

      // switch off click handlers on market site
      this.marketComponent.removeClickHandlerOnMarketCards();
    }

  }


  //===========================================================
  // Backend starts new round
  //===========================================================

    initRound(round: Round){

    //Update internal data arrays with data from backend:
    this.game.roundNumber = round.roundNumber;
    this.game.ships = round.ships;
    this.game.marketCards = round.marketCards;


    //Initialize Market with new cards
    this.initializeMarketComponent(this.game.marketCards);

    //Initialize Departing Harbour with new ships
    this.initializeDepartingHarbourComponent(this.game.ships);

  }


  //===========================================================
  // Backend starts fast forward at the end of the game
  //===========================================================

  initFastForward(){


  }

  //===========================================================
  // Update data for one player field
  //===========================================================

  //TODO add input, pass input to mapFromServer... function
  updatePlayerData(){

    let input = this.mapFromServerToUpdatePlayerDataArray();
    this.updatePlayerDataWithArray(input, ColourEnum.black);

  }

  //TODO add input data format
  mapFromServerToUpdatePlayerDataArray(){

    let returnArray = [1,2,3,4,5,6,7,8,9,10,11,12];
    return returnArray;

  }



  // Input array format:
  //====================
  //
  // [Score, Sled, Quarry, Statue, PyrDec, TemDec, BurDec, ObeDec, Chisel, Hammer, Sail, Lever]
  //    0      1      2      3        4       5       6      7        8      9      10     11
  //

  updatePlayerDataWithArray(input: number[], playerField: ColourEnum){

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
  // Main Task 1: Deactivate everything for inactive players
  //===========================================================


  deactivateInactivePlayerInteractions(amI_CurrentActivePlayer){

    if (!amI_CurrentActivePlayer){
    //loop through players and check not active players

    // TODO!!!
    let stoneHtmlId="stone_dragulaId_2";
    this.departingHarbourComponent.removeClickHandlerOnStone(stoneHtmlId);

    //switch off drag event for stones

    //switch off drag event for ships
    }

  }


  //=============================================================
  // Main Task 2: Activate allowed interactions for activePlayer
  //=============================================================


  activateActivePlayerInteractions(amI_CurrentActivePlayer, currentActivePlayerField){

    if (amI_CurrentActivePlayer) {
      //switch on all click handlers

      // TODO!!!
      let stoneHtmlId = "stone_dragulaId_2";
      this.departingHarbourComponent.setClickHandlerOnStone(stoneHtmlId);

      //switch on drag event for stones


      //switch on drag event for ships

    }

  }

  //===========================================================
  // SnackBar / Toast
  //===========================================================


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


  showLastMoveOfOtherPlayer(){

  }


  collectLastMoveOfActivePlayer(){

  }

  //===========================================================
  // WebSocket / REST Input
  //===========================================================


    setScore(webSocketInput){
    this.bottomLeftComponent.setScore(webSocketInput);
    this.bottomRightComponent.setScore(webSocketInput);
    this.topLeftComponent.setScore(webSocketInput);
    this.topRightComponent.setScore(webSocketInput);
    }

  showSnackbarMessage(webSocketinput) {
    let text_="Player 2  has moved Ship 2 to the Temple"
    let time_=10000
    this.showSnackbarMessenger(text_,time_);
  }

  //===========================================================
  // Main Action 1: take stones from Quarry to Sled
  //===========================================================

  takeStonesFromQuarryToSled(){

    //register click to quarry

    //generate decision object

    //send decision object to backend

  }

  getBroadcastFromQuarryToSledAction() {

    //update sled
    this.bottomLeftComponent.setStonesInSled(this.sledStones_target);
    this.bottomRightComponent.setStonesInSled(this.sledStones_target);
    this.topLeftComponent.setStonesInSled(this.sledStones_target);
    this.topRightComponent.setStonesInSled(this.sledStones_target);

    //update quarry
    this.bottomLeftComponent.setStonesInQuarry(this.quarryStones_target);
    this.bottomRightComponent.setStonesInQuarry(this.quarryStones_target);
    this.topLeftComponent.setStonesInQuarry(this.quarryStones_target);
    this.topRightComponent.setStonesInQuarry(this.quarryStones_target);
  }


  //===========================================================
  // Main Action 2: move stone from sled to shipslot
  //===========================================================



  //===========================================================
  // Main Action 3: move ship to site
  //===========================================================




  //===========================================================
  // Main Action 4: take market card
  //===========================================================

  takeMarketCardFromMarket(){

  }

  getBroadcastTakeMarketCardFromMarket(webSocketInput) {
    this.bottomLeftComponent.setMarketCards(webSocketInput);
    this.bottomRightComponent.setMarketCards(webSocketInput);
    this.topLeftComponent.setMarketCards(webSocketInput);
    this.topRightComponent.setMarketCards(webSocketInput);
  }

  //===========================================================
  // Main Action 5: play blue market card (inclusive order-function)
  //===========================================================







  //==================================================
  // Test-Methods: Communication with Child Components
  //==================================================

  // Communication with PlayerComponent or Players BottomLeftComponent etc. directly
  //--------------------------------------------------------------------------------
  trigger_setPlayerName(){
    this.bottomLeftComponent.setPlayerName(this.playerName_target); //(click)="trigger_setPlayerName()"
    this.bottomRightComponent.setPlayerName(this.playerName_target); //(click)="trigger_setPlayerName()"
    this.topLeftComponent.setPlayerName(this.playerName_target); //(click)="trigger_setPlayerName()"
    this.topRightComponent.setPlayerName(this.playerName_target); //(click)="trigger_setPlayerName()"
  }
  trigger_FieldGlow(){
    this.bottomLeftComponent.playerFieldGlow(this.glow_target);
    this.topLeftComponent.playerFieldGlow(this.glow_target);
    this.bottomRightComponent.playerFieldGlow(this.glow_target);
    this.topRightComponent.playerFieldGlow(this.glow_target);

    this.glow_target = !this.glow_target;
  }
  trigger_setMarketCards(){
    this.bottomLeftComponent.setMarketCards(this.marketCards_target); //(click)="trigger_setMarketCards()"
    this.bottomRightComponent.setMarketCards(this.marketCards_target); //(click)="trigger_setMarketCards()"
    this.topLeftComponent.setMarketCards(this.marketCards_target); //(click)="trigger_setMarketCards()"
    this.topRightComponent.setMarketCards(this.marketCards_target); //(click)="trigger_setMarketCards()"

  }
  trigger_setScore(){
    this.bottomLeftComponent.setScore(this.score_target); //(click)="trigger_setScore()"
    this.bottomRightComponent.setScore(this.score_target); //(click)="trigger_setScore()"
    this.topLeftComponent.setScore(this.score_target); //(click)="trigger_setScore()"
    this.topRightComponent.setScore(this.score_target); //(click)="trigger_setScore()"
  }
  trigger_setStonesInSled(){
    this.bottomLeftComponent.setStonesInSled(this.sledStones_target); //(click)="trigger_setStonesInSled()"
    this.bottomRightComponent.setStonesInSled(this.sledStones_target); //(click)="trigger_setStonesInSled()"
    this.topLeftComponent.setStonesInSled(this.sledStones_target); //(click)="trigger_setStonesInSled()"
    this.topRightComponent.setStonesInSled(this.sledStones_target); //(click)="trigger_setStonesInSled()"

  }
  trigger_setStonesInQuarry(){
    this.bottomLeftComponent.setStonesInQuarry(this.quarryStones_target); //(click)="trigger_setStonesInQuarry()"
    this.bottomRightComponent.setStonesInQuarry(this.quarryStones_target); //(click)="trigger_setStonesInQuarry()"
    this.topLeftComponent.setStonesInQuarry(this.quarryStones_target); //(click)="trigger_setStonesInQuarry()"
    this.topRightComponent.setStonesInQuarry(this.quarryStones_target); //(click)="trigger_setStonesInQuarry()"

  }

  trigger_deactivateOrActivateIcons(){

    this.bottomLeftComponent.deactivateOrActivateIcons(this.playerIconsStatus_target); //(click)="trigger_deactivateOrActivateIcons()"
    this.bottomRightComponent.deactivateOrActivateIcons(this.playerIconsStatus_target); //(click)="trigger_deactivateOrActivateIcons()"
    this.topLeftComponent.deactivateOrActivateIcons(this.playerIconsStatus_target); //(click)="trigger_deactivateOrActivateIcons()"
    this.topRightComponent.deactivateOrActivateIcons(this.playerIconsStatus_target); //(click)="trigger_deactivateOrActivateIcons()"

    //used to toggle boolean array this.playerIconsStatus_target
    for(let i = 0; i < this.playerIconsStatus_target.length; i++){
      this.playerIconsStatus_target[i] = !this.playerIconsStatus_target[i];
    }
  }

  trigger_deactivateOrActivateStoneQuarry(){

    this.bottomLeftComponent.deactivateOrActivateStoneQuarry(this.playerStoneQuarryStatus_target); //(click)="trigger_deactivateOrActivateStoneQuarry()"
    this.bottomRightComponent.deactivateOrActivateStoneQuarry(this.playerStoneQuarryStatus_target); //(click)="trigger_deactivateOrActivateStoneQuarry()"
    this.topLeftComponent.deactivateOrActivateStoneQuarry(this.playerStoneQuarryStatus_target); //(click)="trigger_deactivateOrActivateStoneQuarry()"
    this.topRightComponent.deactivateOrActivateStoneQuarry(this.playerStoneQuarryStatus_target); //(click)="trigger_deactivateOrActivateStoneQuarry()"

  }

  trigger_deactivateOrActivateStoneSled(){

    this.bottomLeftComponent.deactivateOrActivateSupplySled(this.playerSupplySledStatus_target); //(click)="trigger_deactivateOrActivateSupplySled()"
    this.bottomRightComponent.deactivateOrActivateSupplySled(this.playerSupplySledStatus_target); //(click)="trigger_deactivateOrActivateSupplySled()"
    this.topLeftComponent.deactivateOrActivateSupplySled(this.playerSupplySledStatus_target); //(click)="trigger_deactivateOrActivateSupplySled()"
    this.topRightComponent.deactivateOrActivateSupplySled(this.playerSupplySledStatus_target); //(click)="trigger_deactivateOrActivateSupplySled()"

  }

  trigger_deactivateOrActivatePlayerField(){

    this.bottomLeftComponent.deactivateOrActivatePlayerField(this.playerPlayerFieldStatus_target); //(click)="trigger_deactivateOrActivatePlayerField()"
    this.bottomRightComponent.deactivateOrActivatePlayerField(this.playerPlayerFieldStatus_target); //(click)="trigger_deactivateOrActivatePlayerField()"
    this.topLeftComponent.deactivateOrActivatePlayerField(this.playerPlayerFieldStatus_target); //(click)="trigger_deactivateOrActivatePlayerField()"
    this.topRightComponent.deactivateOrActivatePlayerField(this.playerPlayerFieldStatus_target); //(click)="trigger_deactivateOrActivatePlayerField()"

  }


  trigger_setClickHandlerOnBlueMarketCards(){

    this.bottomLeftComponent.setClickHandlerOnBlueMarketCards(); //(click)="trigger_setClickHandlerOnBlueMarketCards()"
    this.bottomRightComponent.setClickHandlerOnBlueMarketCards(); //(click)="trigger_setClickHandlerOnBlueMarketCards()"
    this.topLeftComponent.setClickHandlerOnBlueMarketCards(); //(click)="trigger_setClickHandlerOnBlueMarketCards()"
    this.topRightComponent.setClickHandlerOnBlueMarketCards(); //(click)="trigger_setClickHandlerOnBlueMarketCards()"

  }

  trigger_removeClickHandlerOnBlueMarketCards(){

    this.bottomLeftComponent.removeClickHandlerOnBlueMarketCards(); //(click)="trigger_removeClickHandlerOnBlueMarketCards()"
    this.bottomRightComponent.removeClickHandlerOnBlueMarketCards(); //(click)="trigger_removeClickHandlerOnBlueMarketCards()"
    this.topLeftComponent.removeClickHandlerOnBlueMarketCards(); //(click)="trigger_removeClickHandlerOnBlueMarketCards()"
    this.topRightComponent.removeClickHandlerOnBlueMarketCards(); //(click)="trigger_removeClickHandlerOnBlueMarketCards()"

  }


  // Communication with active player component BottomLeftComponent usw.
  // no delegation to children
  //--------------------------------------------------------------------
  trigger_TemplateFunction(){}/*used to compile*/


  trigger_showSnackbarMessenger() {
    let text_="Hi Player 1,  Player 2  has moved Ship 2 to the Temple, " +
      "be informed, that you have exactly 10 seconds to read this information. After that " +
      "the snackbar will be closed."
    let time_=10000
    this.showSnackbarMessenger(text_,time_);
  }


  trigger_showLastMoveOfOtherPlayer(){



  }


  trigger_collectLastMoveOfActivePlayer(){

  }



  // Communication with DepartingHarbour
  //------------------------------------
  trigger_removeShips(){
    this.departingHarbourComponent.removeShips(); //(click)="trigger_removeShips()"
  }

  trigger_generateFourShips(ship1,ship2,ship3,ship4){
    this.departingHarbourComponent.generateFourShips(this.ships_target); //(click)="trigger_generateFourShips()"
  }

  trigger_generateShip(){
    this.departingHarbourComponent.generateShip(this.ship1); //(click)="trigger_generateShip()"
  }

  trigger_removeShip(id:number){
    this.departingHarbourComponent.removeShip(this.ship4); //(click)="trigger_removeShip()"
  }

  trigger_deactivateShipOnDepartingHarbour(){
    this.departingHarbourComponent.deactivateShipOnDepartingHarbour(this.ship1);//(click)="trigger_deactivateShipOnDepartingHarbour()"

  }

  trigger_activateShipOnDepartingHarbour(){
    this.departingHarbourComponent.ractivateShipOnDepartingHarbour(this.ship1);//(click)="trigger_activateShipOnDepartingHarbour()"

  }

  trigger_countStonesOnShip(){
    this.departingHarbourComponent.countStonesOnShip(this.ship1);//click)="trigger_countStonesOnShip()"

  }


  // Communication with SiteHarbour
  //-------------------------------


  // Communication with MarketHarbour
  //--------------------------------



  // Communication with PyramidComponent
  //------------------------------------
  trigger_placeOnPyramid(){
    this.pyramidComponent.placeStones(this.stones_target); //(click)="trigger_setMarketCards()"
  }

  trigger_removeFromPyramid(){
    this.pyramidComponent.removeStones(); //(click)="trigger_setMarketCards()"
  }

  // Communication with TempleComponent
  //-----------------------------------
  trigger_placeOnTemple(){
    this.templeComponent.placeStones(this.stones_target); //(click)="trigger_setMarketCards()"
  }

  trigger_removeFromTemple(){
    this.templeComponent.removeStones(); //(click)="trigger_setMarketCards()"
  }

  // Communication with BurialChamberComponent
  //------------------------------------------
  trigger_placeOnBurial(){
    this.burialChamberComponent.placeStones(this.stones_target); //(click)="trigger_setMarketCards()"
  }

  trigger_removeFromBurial(){
    this.burialChamberComponent.removeStones(); //(click)="trigger_setMarketCards()"
  }

  // Communication with ObeliskComponent
  //------------------------------------
  trigger_placeOnObelisk(){
    this.obeliskComponent.placeStones(this.stones_target); //(click)="trigger_setMarketCards()"
  }

  trigger_removeFromObelisk(){
    this.obeliskComponent.removeStones(); //(click)="trigger_setMarketCards()"
  }

  // Communication with MarketComponent
  //-----------------------------------
  trigger_removeUnusedMarketCards(){
    this.marketComponent.removeUnusedMarketCards(); //(click)="trigger_removeUnusedMarketCards()"
  }
  trigger_generateFourMarketCards(){
    this.marketComponent.generateFourMarketCards(this.marketCards); //(click)="trigger_generateFourMarketCards()"
  }

  trigger_setClickHandlerOnMarketCards(){
    this.marketComponent.setClickHandlerOnMarketCards(); //(click)="trigger_setClickHandlerOnMarketCards()"
  }

  trigger_removeClickHandlerOnMarketCards(){
    this.marketComponent.removeClickHandlerOnMarketCards(); //(click)="trigger_setClickHandlerOnMarketCards()"
  }


  trigger_deactivateOrActivateMarketCards(){

    //gray out and make unclickable
    this.marketComponent.deactivateOrActivateMarketCards(); //(click)="trigger_deactivateOrActivateMarketCards()"
  }


  // Communication with ShipComponent
  //---------------------------------
  trigger_deactivateOrActivateShips(){

    this.shipComponent.deactivateOrActivateShips();//(click)="trigger_deactivateOrActivateShips()"

  }

  trigger_setClickHandlerOnSlot() {
    //only works via parent, DepatingHarbourComponent or GameComponent
    let slot="ship_2_slot_1";
    this.departingHarbourComponent.setClickHandlerOnSlot(slot);
  }

  trigger_removeClickHandlerOnSlot() {
    //only works via parent, DepatingHarbourComponent or GameComponent
    let slot="ship_3_slot_1";
    this.departingHarbourComponent.removeClickHandlerOnSlot(slot);
  }


  // Communication with InfoBoxComponent
  //---------------------------------
  trigger_increaseRoundInInfoBox(){

    this.infoBoxComponent.increaseRoundInInfoBox(this.roundNumber);//(click)="trigger_increaseRoundInInfoBox()"

  }


  // Communication with Stones
  //---------------------------------

  stoneHtmlId="stone_dragulaId_2";

  trigger_setClickHandlerOnStone(){
    //only works via parent, DepatingHarbourComponent or GameComponent
    this.departingHarbourComponent.setClickHandlerOnStone(this.stoneHtmlId); //(click)="trigger_setClickHandlerOnStone()"
  }

  trigger_removeClickHandlerOnStone(){
    //only works via parent, DepatingHarbourComponent or GameComponent
    this.departingHarbourComponent.removeClickHandlerOnStone(this.stoneHtmlId); //(click)="trigger_removeClickHandlerOnStone()"
  }


  trigger_removeAllStones(){
    this.pyramidComponent.removeStones();
    this.templeComponent.removeStones();
    this.burialChamberComponent.removeStones();
    this.obeliskComponent.removeStones();
  }


  trigger_showStonesInSled(){
    this.bottomLeftComponent.showStone()
    this.topLeftComponent.showStone()
    this.topRightComponent.showStone()
    this.bottomRightComponent.showStone()
  }

  //===================
  // Subscribe-Methods
  //===================





  //===============
  // Other-Methods

  //===============




  //================
  // Dragula-Methods
  //================

  //------------------
  //stone id generator
  //------------------
  stoneId:number=1;

  generateStoneId(){
    this.stoneId+=1;
    return this.stoneId.toString()
  }

  //--------------------------------
  //Dragula Drag Event Subscription
  //--------------------------------
  dragula_subscribeDragEvent() {
    this.dragulaService.drag.subscribe((value) => {

      if(1){console.log("5.1.0 dragula-subscribe-drag");}

      if (value){

        //--------------------------
        //get id of arriving harbour
        //--------------------------
        if(value[0] === 'departing_bag'){
          if(1){console.log("5.2.1 ", `drop: ${value[0]}`);}

          //id of harbour
          let departing_harbour_id=value[2].id;
          if(1){console.log("5.2.2 ", `drop: ${value[2].id}`);}


          //do something with it

        }

        //--------------
        //get id of ship
        //--------------
        if(value[0] === 'harbours_bag') {

          //id of site harbour
          let departing_harbour = value[2];

          if(1){console.log("5.3.1 ", `drag: ${value[0]}`);}


          //change options on drag (pandora's box, TO TEST FIRST)
          if (0) {
            this.dragulaService.setOptions('harbours_bag', {
              invalid: function (el, handle) {}
            });
          }

        }
      }
    });
  }


  //--------------------------------
  //Draguala Drop Event Subscription
  //--------------------------------
  dragula_subscribeDropEvent() {
    this.dragulaService.drop.subscribe((value) => {

      console.log("6.1.0 dragula-subscribe-drop");

      //-------------------------------------------
      //value object not null; otherwise do nothing
      //-------------------------------------------
      if (value[0] && value[1] && value[2]) {


        //----------------------------------------
        //get id of stone slot ('stone_slots_bag')
        //----------------------------------------
        if(value[0] === 'stone_slots_bag'){
          if(1){console.log("6.1.1 ", `drop: ${value[0]}`);}

          //stone slot id
          let stoneSlot=value[2];
          if(1){console.log("6.1.2 ", `drop: ${value[2].id}`);}

        }


        //-----------------------------------
        //set id of stone ('stone_slots_bag')
        //-----------------------------------
        if(value[0] === 'stone_slots_bag'){
          if(1){console.log("6.2.1 ", `drop: ${value[0]}`);}

          //<app-stone>-tag as html string; there should only be one child [0]
          let appStone=value[1];
          if(1){console.log("6.2.2 ", `drop: ${value[1].children[0].className}`);}
          if(1){console.log("6.2.3 ", `drop: ${value[1].children[0].id}`);}

          //stoneDiv-tag
          let stoneDiv=value[1].children[0];
          if(1){console.log("6.2.4 ", `drop: ${value[1].children[0].className}`);}
          if(1){console.log("6.2.5 ", `drop: ${value[1].children[0].id}`);}

          //set stone id in DOM (unique id, starting from 1)
          //------------------------------------------------

          //call function in GameComponent
          let newStoneId:string=this.generateStoneId();


          //determine ship and slot
          let stoneSlotId=value[2].id

          //determine stone colour
          let stoneClass=value[1].children[0].className;
          let stoneColour=stoneClass.trim().substring(9,20);
          let stoneColourSub=stoneColour.substring(0,2)

          //set attribute id in Dom
          stoneDiv.setAttribute("id", stoneSlotId+"_"+stoneColourSub+"_dragulaId_"+newStoneId)
          if(1){console.log("6.2.6 ", `drop: ${value[1].children[0].id}`);}

        }

        //----------------------------------------
        //(Buggy-Dragula Fix)
        //If this drop event is triggered
        // make sure the stone is placed into the slot
        // even if it falls back into the sled
        // ('stone_slots_bag')
        //----------------------------------------
        if(value[0] === 'stone_slots_bag'){
          if(1){console.log("6.3.1 ", `drop: ${value[0]}`);}

          //stone slot id
          let stoneSlot=value[2];
          if(1){console.log("6.3.2 ", `drop: ${value[2].id}`);}

          //<app-stone>-tag
          let appStone=value[1];
          let stoneDiv=value[1].children[0];
          if(1){console.log("6.3.3 ", `drop: ${value[1].children[0].id}`);}

          if(stoneSlot.hasChildNodes()){
            if(1){console.log("6.3.4 ", `drop: stone is in slot`);}
          }else{
            if(1){console.log("6.3.5 ", `drop: stone is back in sled`);}
            stoneSlot.appendChild(appStone);
          }

          //--------------------------------------------
          //call add stone to ship (angular 2 style)
          //--------------------------------------------

          //this.gameComponent.removeStoneFromSled(shipSlotDiv_1_Stone.id);
          //this.shipComponent.addStoneToShip(shipSlotDiv_1_Stone.id);



        }




        //-------------------------------------------
        //get id of arriving harbour ('harbours_bag')
        //-------------------------------------------
        if(value[0] === 'harbours_bag'){
          if(1){console.log("6.3.1 ", `drop: ${value[0]}`);}

          //id of harbour
          let arriving_harbour_id=value[2].id;
          if(1){console.log("6.3.2 ", `drop: ${value[2].id}`);}


          //do something with it


        }

        //--------------------------------------------
        //get id of ship /slot /stone ('harbours_bag')
        // (for informational purposes)
        //--------------------------------------------
        if(value[0] === 'harbours_bag'){
          if(1){console.log("6.4.1 ", `drop: ${value[0]}`);}

          //id of site harbour
          let arriving_harbour=value[2];

          //what is it? the <app-ship>
          if(1){console.log("6.4.2 ", `drop: ${value[1].id}`);}

          //ngifShip <div-tag>
          let ngifShip=document.getElementById(arriving_harbour.id).children[0];
          if(1){console.log("6.4.2-neu ngifShip", `drop: ${ngifShip}`);}

          //<app-ship>-tag as html string; there should only be one child [0]
          let appShip=document.getElementById(ngifShip.id).children[0];
          if(1){console.log("6.4.3 app-ship", `drop: ${appShip}`);}

          //ship <div>-tag as html string
          let shipDiv=document.getElementById(appShip.children[0].id);
          if(0){console.log("6.4.4 shipDiv className ", `drop: ${shipDiv.className}`);}
          if(1){console.log("6.4.5 shipDiv id ", `drop: ${shipDiv.id}`);}

          //ship slots <div>-tag as html string
          let shipSlotsDiv=document.getElementById(shipDiv.children[0].id);
          if(0){console.log("6.4.5 shipSlotsDiv className ", `drop: ${shipSlotsDiv.className}`);}
          if(1){console.log("6.4.6 shipSlotsDiv id ", `drop: ${shipSlotsDiv.id}`);}


          //ship slot_i <div>-tag as html string
          if(shipSlotsDiv.children[0]) {
            let shipSlotDiv_1 = document.getElementById(shipSlotsDiv.children[0].id);
            if (0) {console.log("6.4.7 shipSlotDiv_1 className ", `drop: ${shipSlotDiv_1.className}`);}
            if (1) {console.log("6.4.8 shipSlotDiv_1 id ", `drop: ${shipSlotDiv_1.id}`);}

            //ship slot_i Stone <app-stone>-tag as html string
            if(shipSlotDiv_1.children[0]) {
              let shipSlotDiv_1_AppStone = document.getElementById(shipSlotDiv_1.children[0].id);
              if (0) {console.log("6.4.9 shipSlotDiv_1_AppStone className ", `drop: ${shipSlotDiv_1_AppStone.className}`);}
              if (0) {console.log("6.4.10 shipSlotDiv_1_AppStone id ", `drop: ${shipSlotDiv_1_AppStone.id}`);}

              //ship slot_i Stone <div>-tag as html string
              let shipSlotDiv_1_Stone = document.getElementById(shipSlotDiv_1_AppStone.children[0].id);
              if (0) {console.log("6.4.11 shipSlotDiv_1_Stone className ", `drop: ${shipSlotDiv_1_Stone.className}`);}
              if (0) {console.log("6.4.12 shipSlotDiv_1_Stone id ", `drop: ${shipSlotDiv_1_Stone.id}`);}

              //--------------------------------------------
              //call add stone to site
              //--------------------------------------------

              let leverPlayed = this.playedBlueMarketCard_lever;

              if (leverPlayed) {
                if (1) {console.log("6.5.1 add stone to site manually", `drop: leverPlayed:  ${leverPlayed}`);}

              }
              else {
                if (1) {console.log("6.5.2 add stone to site automatically", `drop: lever Played: ${leverPlayed}`);}

                //this.shipComponent.removeStoneFromShip(shipSlotDiv_1_Stone.id);
                //this.shipComponent.addStoneToSite(shipSlotDiv_1_Stone.id);
              }
              //End: call add stone to site

            }
          }

          //ship slot_i <div>-tag as html string
          if(shipSlotsDiv.children[1]){
            let shipSlotDiv_2=document.getElementById(shipSlotsDiv.children[1].id);
            if(0){console.log("6.4.13 shipSlotDiv_2 className ", `drop: ${shipSlotDiv_2.className}`);}
            if(1){console.log("6.4.14 shipSlotDiv_2 id ", `drop: ${shipSlotDiv_2.id}`);}

            //ship slot_i Stone <app-stone>-tag as html string
            if(shipSlotDiv_2.children[0]) {
              let shipSlotDiv_2_AppStone = document.getElementById(shipSlotDiv_2.children[0].id);
              if (0) {console.log("6.4.15 shipSlotDiv_2_AppStone className ", `drop: ${shipSlotDiv_2_AppStone.className}`);}
              if (0) {console.log("6.4.16 shipSlotDiv_2_AppStone id ", `drop: ${shipSlotDiv_2_AppStone.id}`);}

              //ship slot_i Stone <div>-tag as html string
              let shipSlotDiv_2_Stone = document.getElementById(shipSlotDiv_2_AppStone.children[0].id);
              if (0) {console.log("6.4.17 shipSlotDiv_2_Stone className ", `drop: ${shipSlotDiv_2_Stone.className}`);}
              if (0) {console.log("6.4.18 shipSlotDiv_2_Stone id ", `drop: ${shipSlotDiv_2_Stone.id}`);}
            }
          }

          //ship slot_i <div>-tag as html string
          if(shipSlotsDiv.children[2]){
            let shipSlotDiv_3=document.getElementById(shipSlotsDiv.children[2].id);
            if(0){console.log("6.4.19 shipSlotDiv_3 className ", `drop: ${shipSlotDiv_3.className}`);}
            if(1){console.log("6.4.20 shipSlotDiv_3 id ", `drop: ${shipSlotDiv_3.id}`);}

            //ship slot_i Stone <app-stone>-tag as html string
            if(shipSlotDiv_3.children[0]) {
              let shipSlotDiv_3_AppStone = document.getElementById(shipSlotDiv_3.children[0].id);
              if (0) {console.log("6.4.21 shipSlotDiv_3_AppStone className ", `drop: ${shipSlotDiv_3_AppStone.className}`);}
              if (0) {console.log("6.4.22 shipSlotDiv_3_AppStone id ", `drop: ${shipSlotDiv_3_AppStone.id}`);}

              //ship slot_i Stone <div>-tag as html string
              let shipSlotDiv_3_Stone = document.getElementById(shipSlotDiv_3_AppStone.children[0].id);
              if (0) {console.log("6.4.23 shipSlotDiv_3_Stone className ", `drop: ${shipSlotDiv_3_Stone.className}`);}
              if (0) {console.log("6.4.24 shipSlotDiv_3_Stone id ", `drop: ${shipSlotDiv_3_Stone.id}`);}
            }
          }

          //ship slot_i <div>-tag as html string
          if(shipSlotsDiv.children[3]){
            let shipSlotDiv_4=document.getElementById(shipSlotsDiv.children[3].id);
            if(0){console.log("6.4.25 shipSlotDiv_4 className ", `drop: ${shipSlotDiv_4.className}`);}
            if(1){console.log("6.4.26 shipSlotDiv_4 id ", `drop: ${shipSlotDiv_4.id}`);}

            //ship slot_i Stone <app-stone>-tag as html string
            if(shipSlotDiv_4.children[0]) {
              let shipSlotDiv_4_AppStone = document.getElementById(shipSlotDiv_4.children[0].id);
              if (0) {console.log("6.4.27 shipSlotDiv_4_AppStone className ", `drop: ${shipSlotDiv_4_AppStone.className}`);}
              if (0) {console.log("6.4.28 shipSlotDiv_4_AppStone id ", `drop: ${shipSlotDiv_4_AppStone.id}`);}

              //ship slot_i Stone <div>-tag as html string
              let shipSlotDiv_4_Stone = document.getElementById(shipSlotDiv_4_AppStone.children[0].id);
              if (0) {console.log("6.4.29 shipSlotDiv_4_Stone className ", `drop: ${shipSlotDiv_4_Stone.className}`);}
              if (0) {console.log("6.4.30 shipSlotDiv_4_Stone id ", `drop: ${shipSlotDiv_4_Stone.id}`);}
            }
          }










        }

      }

    });
  }


  //-----------------------------------
  //Draguala Ship Movement Set Options
  //-----------------------------------
  dragulaShipMovement_setOptions(isCurrentActivePlayer:boolean){

    //-----------------------------------
    //Options for the currentActivePlayer
    //he has all options acc. to the rules
    //-----------------------------------
    if (isCurrentActivePlayer){

      this.dragulaService.setOptions('harbours_bag', {

        accepts: function (el, target, source, sibling) {

          /*where drop is allowed*/

          console.log("testString", this.testString);

          if(0){console.log("harbours_bag:accepts ", `el: ${el}`);
          console.log("harbours_bag:accepts ", `source: ${source}`);
          console.log("harbours_bag:accepts ", `target: ${target}`);
          console.log("harbours_bag:accepts ", `sibling: ${sibling}`);}

          if (el && target && source){

            let isEmpty = target.innerHTML === "";
            let isArrivingHarbour = target.parentElement.id === "arriving_harbours";


            if(0){console.log("10.1.1 ", `el: ${el}`); //moved element
             console.log("10.1.2 ", `el.id: ${el.id}`); //its id
             console.log("10.2.1 ", `source: ${source}`); //source element
             console.log("10.2.2 ", `source.id: ${source.id}`); //its id
             console.log("10.2.1 ", `sibling: ${sibling}`);
             console.log("10.3.1 ", `target: ${target}`); //target element
             console.log("10.3.2 ", `target.id: ${target.id}`); //its id
             console.log("10.3.3 ", `target.innerHTML: ${target.innerHTML}`); //its innerHTML
             console.log("10.4.1 ", `target.parentElement: ${target.parentElement}`);
             console.log("10.4.2 ", `target.parentElement.id: ${target.parentElement.id}`);
             console.log("10.5.1 ", "isEmpty: " ,isEmpty);
             console.log("10.5.2 ", "isArrivingHarbour: " ,isArrivingHarbour);}


            if (isEmpty && isArrivingHarbour) {
              if(0){console.log("10.6.1 dragula-accepts:", "---ArrivingHarbour (True=drop allowed)---");}
              return true;
            }
            else {
                if(0){console.log("10.6.2 dragula-accepts", "---ArrivingHarbour (False=drop disallowed)---");}
              return false;
            }
          }
        },

        moves: function (el, source, handle, sibling) {

          /*element draggable*/

          if(0){console.log("harbours_bag:moves ", `el: ${el}`);
          console.log("harbours_bag:moves ", `source: ${source}`);
          console.log("harbours_bag:moves ", `handle: ${handle}`);}

          if (el && source && handle){
            return true; //true: elements are always draggable by default
          }
          else{
            return false;
          }
        },

        isContainer: function (el) {

          if(0){console.log("harbours_bag:iscontainer ", `el: ${el}`);}

          if (el) {
            return false;  //only elements in drake.containers will be taken into account
          }
        },

        invalid: function (el, handle) {

          /*where drag is disallowed*/

          if(0){console.log("harbours_bag:invalid ", `el: ${el}`);
          console.log("harbours_bag:invalid ", `handle: ${handle}`);
          console.log("harbours_bag:invalid ", `el.id: ${el.id}`);
          console.log("harbours_bag:invalid ", `el.parent.parent.id: ${el.parentElement.parentElement.parentElement.id}`);}


          /*departing harbour check: if isDepartingHarbour then set invalid...BUT...*/
          if (el && handle && el.parentElement && el.parentElement.parentElement
            && el.parentElement.parentElement.parentElement) {

            /*...BUT if enoughStones then set valid */

            let isDepartingHarbour = el.parentElement.parentElement.parentElement.id === "departing_harbours";

            if(1){console.log("10.11.1 dragula-invalid", `isDepartingHarbour: ${isDepartingHarbour}`);};
              if(isDepartingHarbour){

                //<app-ship>
                let appShip_id=el.id;
                if(0){console.log("10.11.2 dragula-invalid", `appShip_id: ${appShip_id}`);};

                //ship-<div>
                let divShip_id=el.children[0].id;
                if(0){console.log("10.11.3 dragula-invalid", `divShip_id: ${divShip_id}`);};

                //ship-slots<div>
                let divShip_divSlots_id = el.children[0].children[0].id;
                if(0){console.log("10.11.4 dragula-invalid", `divShip_divSlots_id: ${divShip_divSlots_id}`);};

                //not needed
                let divShip_divSlots_divSlot_id = el.children[0].children[0].children[0].id;
                if(0){console.log("10.11.5 dragula-invalid", `divShip_divSlots_divSlot_id: ${divShip_divSlots_divSlot_id}`);};

                //may not exist
                let divShip_divSlots_divSlot_divNgIf = el.children[0].children[0].children[0].children[0];
                if(0){console.log("10.11.6 dragula-invalid", `divShip_divSlots_divSlot_divNgIf: ${divShip_divSlots_divSlot_divNgIf}`);};


                //has ship enough stones
                //----------------------
                //(no helper functions allowed: this.hasShipEnoughStones(ship_i_slots_id);)

                //count slots
                let divShip_divSlots = el.children[0].children[0].children[0];
                let countSlots:number=0;
                if(divShip_divSlots.children[0]){
                  countSlots+=1;
                }
                if(divShip_divSlots.children[1]){
                  countSlots+=1;
                }
                if(divShip_divSlots.children[2]){
                  countSlots+=1;
                }
                if(divShip_divSlots.children[3]){
                  countSlots+=1;
                }
                if(0){console.log("10.11.8 dragula-invalid", `countSlots: ${countSlots}`);};


                //count stones
                let countStones:number=0;
                if(divShip_divSlots.children[0]){
                  if(divShip_divSlots.children[0].children[0].children[0]){countStones+=1;}
                }
                if(divShip_divSlots.children[1]){
                  if(divShip_divSlots.children[1].children[0].children[0]){countStones+=1;}
                }
                if(divShip_divSlots.children[2]){
                  if(divShip_divSlots.children[2].children[0].children[0]){countStones+=1;}
                }
                if(divShip_divSlots.children[3]){
                  if(divShip_divSlots.children[3].children[0].children[0]){countStones+=1;}
                }
                if(0){console.log("10.11.9 dragula-invalid", `countStones: ${countStones}`);};


                //check if it can move
                let hasNotEnoughStones=true;
                if(countSlots==1){
                  if(countStones==1){hasNotEnoughStones=false;}
                }
                if(countSlots==2){
                  if(countStones>=1){hasNotEnoughStones=false;}
                }
                if(countSlots==3){
                  if(countStones>=2){hasNotEnoughStones=false;}
                }
                if(countSlots==4){
                  if(countStones>=3){hasNotEnoughStones=false;}
                }
                if(1){console.log("10.11.10 dragula-invalid", `hasNotEnoughStones: ${hasNotEnoughStones}`);};


                let isInvalid = hasNotEnoughStones;

                if(0){console.log("10.11.11 dragula-invalid", `isInvalid : ${isInvalid}`);};
                if (isInvalid) {
                  if(1){console.log("10.11.12 dragula-invalid", "---DepartingHarbour (True=drag disallowed)---");}
                  return true;
                }
                else {
                  if(1){console.log("10.11.13 dragula-invalid", "---DepartingHarbour (False=drag allowed)---");}
                  return false; //false: don't prevent any drags from initiating by default
                }
              }
          }


          /*arriving harbour check: if isArrivingHarbour then set invalid*/
          if (el && handle && el.parentElement && el.parentElement.parentElement) {

            let isArrivingHarbour = el.parentElement.parentElement.id === "arriving_harbours";
            let isInvalid = isArrivingHarbour;
            if(0){console.log("10.12.0 dragula-invalid", `isArrivingHarbour: ${isArrivingHarbour}`);}

            if (isInvalid) {
              if(1){console.log("10.12.1 dragula-invalid", "---ArrivingHarbour (True=drag disallowed)---");}
              return true;
            }
            else {
                if(1){console.log("10.12.2 dragula-invalid", "---ArrivingHarbour (False=drag allowed)---");}
              return false; //false: don't prevent any drags from initiating by default
            }
          }

        },

        direction: 'vertical',  //X (horizontal) or Y axis (vertical) is considered when determining where an element would be dropped

        copy: function (el, source) {

          /*elements are copied or moved*/

          if(0){console.log("harbours_bag:copy ", `el: ${el}`);
          console.log("harbours_bag:copy ", `source: ${source}`);}

          if (el && source) {

            let isCopyClass = el.classList.contains('you-may-copy-us'); //the css class name
            let isCopyId = el.id === '#you-may-copy-me'; //the css id; but use a className for this


            if(0){console.log("10.15.1 ", `el.id: ${el.id}`); //moved element
             console.log("10.15.2 ", `el.className: ${el.className}`);
             console.log("10.15.1 ", `el.isCopyClass: ${isCopyClass}`);
             console.log("10.15.2 ", `el.isCopyId: ${isCopyId}`);}

            if (isCopyClass || isCopyId) {
              if(0){console.log("10.16.1 dragula-accepts", "---ArrivingHarbour (True=copy disallowed)---");}
              return true;
            }
            else {
                if(0){console.log("10.16.2 dragula-accepts", "---ArrivingHarbour (False=copy disallowed)---");}
              return false;
            }
          }

        },

        //spilling will put the element back where it was dragged from, if this is true
        revertOnSpill: false,

        //spilling will `.remove` the element, if this is true
        removeOnSpill: false,

      });

    }

    //------------------------------------------
    //Options for all the currentInActivePlayers
    // they cannot drag anything
    //------------------------------------------
    else{

      this.dragulaService.setOptions('harbours_bag', {

        accepts: function (el, target, source, sibling) {

          /*where drop is allowed*/

          return false; //nowhere is drop allowed

        },

        moves: function (el, source, handle, sibling) {

          /*element draggable*/

          return false; //none is draggable
        },

        isContainer: function (el) {

          if(0){console.log("harbours_bag:iscontainer ", `el: ${el}`);}

          if (el) {
            return false;  //only elements in drake.containers will be taken into account
          }
        },

        invalid: function (el, handle) {

          /*where drag is disallowed*/

          return true; //everywhere is drag disallowed

        },

        direction: 'vertical',  //X (horizontal) or Y axis (vertical) is considered when determining where an element would be dropped

        copy: function (el, source) {

          /*elements are copied or moved*/

          if (el && source) {

            let isCopyClass = el.classList.contains('you-may-copy-us'); //the css class name
            let isCopyId = el.id === '#you-may-copy-me'; //the css id; but use a className for this

            if (isCopyClass || isCopyId) {
              if(0){console.log("10.16.1 dragula-accepts", "---ArrivingHarbour (True=copy disallowed)---");}
              return true;
            }
            else {
              if(0){console.log("10.16.2 dragula-accepts", "---ArrivingHarbour (False=copy disallowed)---");}
              return false;
            }
          }

        },

        //spilling will put the element back where it was dragged from, if this is true
        revertOnSpill: false,

        //spilling will `.remove` the element, if this is true
        removeOnSpill: false,

      });


    }
  }


  //-----------------------------------
  //Draguala Stone Movement Set Options
  //-----------------------------------

  dragulaStoneMovement_setOptions(isCurrentActivePlayer:boolean){

    //-----------------------------------
    //Options for the currentActivePlayer
    //-----------------------------------
    if (isCurrentActivePlayer){

      this.dragulaService.setOptions('stone_slots_bag', {

        accepts: function (el, target, source, sibling) {

          /*where drop is allowed*/

          if(0){console.log("stone_slots_bag:accepts ", `el: ${el}`);
          console.log("stone_slots_bag:accepts ", `source: ${source}`);
          console.log("stone_slots_bag:accepts ", `target: ${target}`);
          console.log("stone_slots_bag:accepts ", `sibling: ${sibling}`);}

          if (el && target && source && target.children[0]){

            //let isEmpty = target.innerHTML === ""; //old version
            //target is class ship_slot or id ship_i_slot_j
            let isEmpty = target.children[0].children[0]=== null; //no stone in slot
            let isStoneSlot_1 = target.parentElement.id === "ship_1_slots";
            let isStoneSlot_2 = target.parentElement.id === "ship_2_slots";
            let isStoneSlot_3 = target.parentElement.id === "ship_3_slots";
            let isStoneSlot_4 = target.parentElement.id === "ship_4_slots";


            if(0){console.log("11.1.1 ", `el: ${el}`); //moved element
             console.log("11.1.2 ", `el.id: ${el.id}`); //its id
             console.log("11.2.1 ", `source: ${source}`); //source element
             console.log("11.2.2 ", `source.id: ${source.id}`); //its id
             console.log("11.2.1 ", `sibling: ${sibling}`);
             console.log("11.3.1 ", `target: ${target}`); //target element
             console.log("11.3.2 ", `target.id: ${target.id}`); //its id
             console.log("11.3.3 ", `target.innerHTML: ${target.innerHTML}`); //its innerHTML
             console.log("11.4.1 ", `target.parentElement: ${target.parentElement}`);
             console.log("11.4.2 ", `target.parentElement.id: ${target.parentElement.id}`);
             console.log("11.5.1 ", "isEmpty: " ,isEmpty);
             console.log("11.5.2 ", "isStoneSlot_1: " ,isStoneSlot_1);
             console.log("11.5.3 ", "isStoneSlot_2: " ,isStoneSlot_2);
             console.log("11.5.4 ", "isStoneSlot_3: " ,isStoneSlot_3);
             console.log("11.5.5 ", "isStoneSlot_4: " ,isStoneSlot_4);}


            if (isEmpty && (isStoneSlot_1 || isStoneSlot_2 || isStoneSlot_3 || isStoneSlot_4 )) {
              if(0){console.log("11.6.1 dragula-accepts:", "---ship slots (True=drop allowed)---");}
              return true;
            }
            else {
                if(0){console.log("11.6.2 dragula-accepts:", "---ship slots (True=drop allowed)---");}
              return false;
            }
          }

        },

        moves: function (el, source, handle, sibling) {

          if(0){console.log("stone_slots_bag:moves ", `el: ${el}`);
          console.log("stone_slots_bag:moves ", `source: ${source}`);
          console.log("stone_slots_bag:moves ", `handle: ${handle}`);}


          if (el && source && handle) {
            return true; //true: elements are always draggable by default
          }
          else{
            return false;
          }
        },

        isContainer: function (el) {

          if(0){console.log("stone_slots_bag:iscontainer ", `el: ${el}`);}

          if (el) {
            return false;  //only elements in drake.containers will be taken into account
          }
          else{
            return true;
          }
        },

        invalid: function (el, handle) {

          /*where drag is disallowed*/

          if(0){console.log("stone_slots_bag:invalid ", `el: ${el}`);
          console.log("stone_slots_bag:invalid ", `handle: ${handle}`);
          console.log("stone_slots_bag:invalid ", `el.parent.parent: ${el.parentElement.parentElement}`);}

          if (el && handle && el.parentElement.parentElement && el.parentElement.parentElement.parentElement) {

            let isStoneSlot = el.parentElement.parentElement.parentElement.classList.contains('ship_slots');
            let isInvalid = isStoneSlot;

            if (isInvalid) {
              if(0){console.log("10.10.1 dragula-invalid:", "---ship slots (True=drag disallowed)---");}

              return true;
            }
            else {
              if(0){console.log("10.10.2 dragula-invalid:", "---ship slots (False=drag allowed)---");}

              return false; //false: don't prevent any drags from initiating by default
            }
          }

        },

        direction: 'vertical',  //X (horizontal) or Y axis (vertical) is considered when determining where an element would be dropped

        //copy: true, //false: elements are moved by default, not copied. true: copies el to target and leaves it in source
        copy: function (el, source) {

          /*elements are copied or moved*/

          if(0){console.log("stone_slots_bag:copy ", `el: ${el.id}`);
          console.log("stone_slots_bag:copy ", `source: ${source}`);}


          if (el && source) {

            let isCopyClass = el.classList.contains('you-may-copy-us'); //the css class name
            let isCopyId = el.id === '#you-may-copy-me'; //the css id; but use a className for this


            if(0){console.log("11.15.1 ", `el.id: ${el.id}`); //moved element
             console.log("11.15.2 ", `el.className: ${el.className}`);
             console.log("11.15.1 ", `el.isCopyClass: ${isCopyClass}`);
             console.log("11.15.2 ", `el.isCopyId: ${isCopyId}`);}

            if (isCopyClass || isCopyId) {
              if(0){console.log("11.16.1 dragula-copy:", "---stones (True=copy allowed)---");}
              return true;
            }
            else {
                if(0){console.log("11.16.2 dragula-copy:", "---stones (False=copy disallowed)---");}
              return false;
            }
          }

        },

        //spilling will put the element back where it was dragged from, if this is true
        revertOnSpill: false,

        // spilling will `.remove` the element, if this is true
        removeOnSpill: false,
      });
    }

    //--------------------------------------
    //Options for the currentInActivePlayers
    //--------------------------------------
    else{

      this.dragulaService.setOptions('stone_slots_bag', {

        accepts: function (el, target, source, sibling) {

          /*where drop is allowed*/

          return false; //nowhere allowed

        },

        moves: function (el, source, handle, sibling) {

          return false; //true: elements are always draggable by default

        },

        isContainer: function (el) {

          if(0){console.log("stone_slots_bag:iscontainer ", `el: ${el}`);}

          if (el) {
            return false;  //only elements in drake.containers will be taken into account
          }
          else{
            return true;
          }
        },

        invalid: function (el, handle) {

          /*where drag is disallowed*/

          return true; //everywhere disallowd

        },

        direction: 'vertical',  //X (horizontal) or Y axis (vertical) is considered when determining where an element would be dropped

        //copy: true, //false: elements are moved by default, not copied. true: copies el to target and leaves it in source
        copy: function (el, source) {

          /*elements are copied or moved*/


          if (el && source) {

            let isCopyClass = el.classList.contains('you-may-copy-us'); //the css class name
            let isCopyId = el.id === '#you-may-copy-me'; //the css id; but use a className for this


            if(0){console.log("11.15.1 ", `el.id: ${el.id}`); //moved element
              console.log("11.15.2 ", `el.className: ${el.className}`);
              console.log("11.15.1 ", `el.isCopyClass: ${isCopyClass}`);
              console.log("11.15.2 ", `el.isCopyId: ${isCopyId}`);}

            if (isCopyClass || isCopyId) {
              if(0){console.log("11.16.1 dragula-copy:", "---stones (True=copy allowed)---");}
              return true;
            }
            else {
              if(0){console.log("11.16.2 dragula-copy:", "---stones (False=copy disallowed)---");}
              return false;
            }
          }

        },

        //spilling will put the element back where it was dragged from, if this is true
        revertOnSpill: false,

        // spilling will `.remove` the element, if this is true
        removeOnSpill: false,
      });
    }


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

  // Enable communication with DepartingHarbour
  @ViewChild(DepartingHarbourComponent) departingHarbourComponent:DepartingHarbourComponent;

  // Enable communication with SiteHarbour
  @ViewChild(SiteHarbourComponent) siteHarbourComponent:SiteHarbourComponent;

  // Enable communication with MaketHarbour
  @ViewChild(MarketHarbourComponent) maketHarbourComponent:MarketHarbourComponent;

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

  // Enable communication with ShipComponent
  @ViewChild(ShipComponent) shipComponent:ShipComponent;

  // Enable communication with InfoBoxComponent
  @ViewChild(InfoBoxComponent) infoBoxComponent:InfoBoxComponent;

  // Enable communication with StoneComponent
  @ViewChild(StoneComponent) stoneComponent:StoneComponent;

}
