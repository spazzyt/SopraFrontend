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
import {GameStatusEnum} from "../shared/models/game-status.enum";
import {ActionEnum} from "../shared/models/action.enum";
import {PositionEnum} from "../shared/models/position.enum";
import {Action} from "../shared/models/action";
import {Move} from "../shared/models/move";


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
  amI_CurrentActivePlayer:boolean;

  // my player field
  myPlayerField:ColourEnum;

  // player field of current active player
  currentActivePlayerField:ColourEnum;


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

    //snackbar div in game footer (has to be in ngOnInit, not in Constructor)
    this.generateSnackbarDiv();

    //Initialize the whole market card set
    for (let i=1; i<=34; i++){
      this.game.wholeMarketCardSet.push(new MarketCard(i));
    }



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



    let returnGame = new Game(0, 'token', 'name', GameStatusEnum.round1, 4,  this.players_target, 1, this.ships_target, this.marketCards, this.currentActivePlayerField, null);
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
    this.amI_CurrentActivePlayer=amI_CurrentActivePlayer; //important for dragula to work

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

    //Update internal data arrays with data from backend:
    this.game.roundNumber = round.roundNumber;
    this.game.ships = round.ships;
    this.game.marketCards = round.marketCards;

    //remove stones from ships (with JQuery?)

    //remove ships from arriving harbours (with JQuery?)

    //Initialize Market with new cards
    this.initializeMarketComponent(this.game.marketCards);

    //Initialize Departing Harbour with new ships
    this.initializeDepartingHarbourComponent(this.game.ships);

    //increase round in info box
    this.infoBoxComponent.increaseRoundInInfoBox(this.roundNumber);

  }



  //===========================================================
  // Backend starts fast forward at the end of the game
  //===========================================================

  initFastForward(){




  }

  //===========================================================
  // Update Game UI for one Decision of another client
  //===========================================================
  updateGameforOneDecision(newDecision_:Decision){

    //update game object
    this.game.addDecision(newDecision_);

    //check whether it was your decision
    let isItMyDecision:boolean=newDecision_.decisionMadeBy===this.myPlayerField;

    //update game UI only, if it was not your decision
    if (!isItMyDecision) {
      this.updateUiForOneMove(newDecision_, isItMyDecision);
    }

  }

  updateUiForOneMove(newDecision_:Decision, isItMyDecision:boolean) {

    //In the hope this is what we get from backend.
    let lastDecisionActionName = newDecision_.madeAction.actionName;
    let lastDecisionActionName2 = newDecision_.madeAction.actionName2;
    let lastDecisionActionName3 = newDecision_.madeAction.actionName3;

    //update game UI only, if it was not your decision
    if (!isItMyDecision) {

      //Took Stones from Quarry
      //-----------------------
      if (lastDecisionActionName === ActionEnum.fillSledWithStonesFromQuarry) {

        //update Numbers on PlayerField: Quarry and Sled
        this.updatePlayerData();

        //show Snackbarinfo
        let text="replace this string";
        this.showSnackbarMessage(text);

      }

      //Placed Stone on Ship
      //-------------------
      else if (lastDecisionActionName === ActionEnum.placeStoneFromSledToShip) {

        //update Numbers on PlayerField: Sled
        this.updatePlayerData();

        //show stone on ship
        this.updateStoneOnShip();

        //show Snackbarinfo
        let text="replace this string";
        this.showSnackbarMessage(text);

      }

      //Sail Ship to left side of island (no blue market card was not played)
      //-----------------------------------------------------------------------
      else if (lastDecisionActionName === ActionEnum.sailShip
          && !(lastDecisionActionName2 === ActionEnum.sailShipToMarket)
          && !(lastDecisionActionName3 === ActionEnum.playBlueMarketCard)) {

        //update Numbers on PlayerField: Score
        this.updatePlayerData();

        //remove ship from departing harbour
        this.removeShipFromDepartingHarbour();

        //add ship to arriving harbour
        this.addShipToArrivingHarbour();

        //place stones to site
        this.placeStonesToSite();

        //show Snackbarinfo
        let text="replace this string";
        this.showSnackbarMessage(text);

      }

      //Sailed Ship to market (no blue market card was not played)
      //------------------------------------------------------------
      else if (lastDecisionActionName === ActionEnum.sailShip
        && (lastDecisionActionName2 === ActionEnum.sailShipToMarket)
        && !(lastDecisionActionName3 === ActionEnum.playBlueMarketCard)) {

        //remove ship from departing harbour
        this.removeShipFromDepartingHarbour();

        //add ship to arriving harbour
        this.addShipToArrivingHarbour();

        //show Snackbarinfo
        let text="replace this string";
        this.showSnackbarMessage(text);

      }

      //Took Red Card from Market
      //-------------------------
      else if (lastDecisionActionName === ActionEnum.sailShip
        && (lastDecisionActionName2 === ActionEnum.sailShipToMarket)) {

        //update Numbers on PlayerField: Quarry
        this.updatePlayerData();

        //remove Card from Market
        this.removeCardFromMarket();

        //add stones to Site
        this.addTwoStonesToSite();

        //show Snackbarinfo
        let text="replace this string";
        this.showSnackbarMessage(text);

      }

      //Took NO Red but another Card from Market
      //----------------------------------------
      else if (lastDecisionActionName === ActionEnum.sailShip
        && (lastDecisionActionName2 === ActionEnum.sailShipToMarket)) {

        //update Numbers on PlayerField: MarketCardIcons
        this.updatePlayerData();

        //remove Card from Market
        this.removeCardFromMarket();

        //show Snackbarinfo
        let text="replace this string";
        this.showSnackbarMessage(text);

      }

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
        this.removeShipFromDepartingHarbour();

        //add ship to arriving harbour
        this.addShipToArrivingHarbour();

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

      //Played Blue Market Card Lever (Sail Ship to left side of island)
      //----------------------------------------------------------------
      else if (lastDecisionActionName === ActionEnum.playBlueMarketCardLever
          && !(lastDecisionActionName2 === ActionEnum.sailShipToMarket)) {

        //update Numbers on PlayerField: Sled
        this.updatePlayerData();

        //remove ship from departing harbour
        this.removeShipFromDepartingHarbour();

        //add ship to arriving harbour
        this.addShipToArrivingHarbour();

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
        this.removeShipFromDepartingHarbour();

        //add ship to arriving harbour
        this.addShipToArrivingHarbour();

        //switch order of stones on ship
        this.switchOrderOfStonesOnShip();

        //show Snackbarinfo
        let text="replace this string"
        this.showSnackbarMessage(text);

      }

    }

  }


  //------------------
  //helper functions
  //------------------

  //show stone on ship
  updateStoneOnShip(){

  }

  //remove ship from departing harbour
  removeShipFromDepartingHarbour(){

  }

  //add ship to arriving harbour
  addShipToArrivingHarbour(){

  }

  //place stones to site
  placeStonesToSite(){

  }

  //remove stone from ship, place it to quarry
  removeStoneFromShip(){

  };

  //remove Card from Market
  removeCardFromMarket(){

  };

  //add stones to Site
  addTwoStonesToSite(){

  };

  //switch order of stones on ship
  switchOrderOfStonesOnShip(){


  };


  //===========================================================
  // Update data for one player field
  // e.g. helper function for function like "updateUiForOneMove()"
  //===========================================================

  //TODO add input, pass input to mapFromServer... function
  updatePlayerData(){

    let input = this.mapFromServerToUpdatePlayerDataArray();
    this.updatePlayerDataWithArray(input, ColourEnum.black);
    this.updateGameModelPlayerData(input, ColourEnum.black);

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

  private updateGameModelPlayerData(input_: number[], playerField_: ColourEnum){
    if(playerField_==ColourEnum.black){
      this.game.playerFieldIconsBlack=input_;
    }
    if(playerField_==ColourEnum.white){
      this.game.playerFieldIconsWhite=input_;
    }
    if(playerField_==ColourEnum.brown){
      this.game.playerFieldIconsBrown=input_;
    }
    if(playerField_==ColourEnum.gray){
      this.game.playerFieldIconsGray=input_;
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
    let time_= 10000; //show 10 seconds
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

      //Dragula Options
      //------------------------------------------
      //-automatically inactivate all ships
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
  // Main Task 2: Active Player receives his Decision Object
  // Activate allowed interactions
  //=============================================================


  activateActivePlayerInteractions(Decision_:Decision,
                                   amI_CurrentActivePlayer:boolean,
                                   currentActivePlayerField:ColourEnum){

    if (amI_CurrentActivePlayer) {

      //------------------------------------
      //ToDo:Parse Decision Object
      //ToDo:---------------------
      //ToDo:
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
      //ToDo:hide/show object for:
      //ToDo:--------------------
      //ToDo:Sled Stone
      //ToDo:
      //ToDo:Set/remove drag/drop handlers for:
      //ToDo:----------------------------------
      //ToDo:ships (dragula option should do that automatically)
      //ToDo:stones on ship (dragula option should do that automatically)
      //ToDo:
      //ToDo:Check whether:
      //ToDo:--------------
      //ToDo:Client state on ships is what decision object says
      //------------------------------------



      //I am active player on black field
      //--------------------------------
      if(currentActivePlayerField===ColourEnum.black){

        //show my stone in sled, hide the others
        //BUT only if enough stones in sled
        if(this.game.bottomLeft_sledStones>0){
          this.bottomLeftComponent.showStone();
        }
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
        if(1){console.log([0,1,2,3,4,5,6,7,8,9,10,11].slice(3,11));}
        this.bottomLeftComponent.deactivateOrActivateIcons(this.game.playerFieldIconsBlackAsBoolean.slice(3,11));
        this.bottomRightComponent.deactivateOrActivateIcons(this.game.playerFieldIconsWhiteAsBoolean.slice(3,11));
        this.topLeftComponent.deactivateOrActivateIcons(this.game.playerFieldIconsBrownAsBoolean.slice(3,11));
        this.topRightComponent.deactivateOrActivateIcons(this.game.playerFieldIconsGrayAsBoolean.slice(3,11));

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
        if(this.game.topLeft_sledStones>0){
          this.topLeftComponent.showStone();
        }
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
        if(this.game.bottomLeft_sledStones>0){
          this.topRightComponent.showStone();
        }
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
        if(this.game.bottomLeft_sledStones>0){
          this.bottomRightComponent.showStone();
        }


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

  }


  //===========================================================
  // Main Action 1: take stones from Quarry to Sled
  //===========================================================
  bottomLeftComponent_onEvent_setClickHandlerOnStoneQuarry_sledStones(data:number){
    this.game.bottomLeft_sledStones=data;
    this.takeStonesFromQuarryToSled(ColourEnum.black);
  }
  bottomLeftComponent_onEvent_setClickHandlerOnStoneQuarry_quarryStones(data:number){
    this.game.bottomLeft_quarryStones=data;
  }


  topLeftComponent_onEvent_setClickHandlerOnStoneQuarry_sledStones(data:number){
    this.game.topLeft_sledStones=data;
    this.takeStonesFromQuarryToSled(ColourEnum.white);
  }
  topLeftComponent_onEvent_setClickHandlerOnStoneQuarry_quarryStones(data:number){
    this.game.topLeft_quarryStones=data;
  }


  topRightComponent_onEvent_setClickHandlerOnStoneQuarry_sledStones(data:number){
    this.game.topRight_sledStones=data;
    this.takeStonesFromQuarryToSled(ColourEnum.brown);
  }
  topRightComponent_onEvent_setClickHandlerOnStoneQuarry_quarryStones(data:number){
    this.game.topRight_quarryStones=data;
  }


  bottomRightComponent_onEvent_setClickHandlerOnStoneQuarry_sledStones(data:number){
    this.game.bottomRight_sledStones=data;
    this.takeStonesFromQuarryToSled(ColourEnum.gray);
  }
  bottomRightComponent_onEvent_setClickHandlerOnStoneQuarry_quarryStones(data:number){
    this.game.bottomRight_quarryStones=data;
  }


  takeStonesFromQuarryToSled(playerField:ColourEnum){

    //called from click event in player field components
    if(1){console.log("take stones from Quarry to Sled");}

    //make calculations
    let stonesInQuarry:number;
    let stonesInSled:number;
    let howMany:number;

    if(playerField===ColourEnum.black){
      stonesInQuarry=this.game.bottomLeft_quarryStones;
      stonesInSled=this.game.bottomLeft_sledStones;

      if(stonesInQuarry>=3 && stonesInSled<=2){howMany=3;}
      else if(stonesInQuarry==2 && stonesInSled<=2){howMany=2;}
      else if(stonesInQuarry==1 && stonesInSled<=2){howMany=1;}
      else if(stonesInQuarry>=2 && stonesInSled==3){howMany=2;}
      else if(stonesInQuarry==1 && stonesInSled==3){howMany=1;}
      else if(stonesInQuarry>=1 && stonesInSled==4){howMany=1;}
      else{
        this.showSnackbarMessage("you can not take stones from the quarry")
        return;
      }

      //change numbers
      this.game.bottomLeft_quarryStones-=howMany;
      this.game.bottomLeft_sledStones+=howMany;
      this.bottomLeftComponent.quarryStones-=howMany;
      this.bottomLeftComponent.sledStones+=howMany;


    }
    else if(playerField===ColourEnum.white){
      stonesInQuarry=this.game.topLeft_quarryStones;
      stonesInSled=this.game.topLeft_sledStones;

      if(stonesInQuarry>=3 && stonesInSled<=2){howMany=3;}
      else if(stonesInQuarry==2 && stonesInSled<=2){howMany=2;}
      else if(stonesInQuarry==1 && stonesInSled<=2){howMany=1;}
      else if(stonesInQuarry>=2 && stonesInSled==3){howMany=2;}
      else if(stonesInQuarry==1 && stonesInSled==3){howMany=1;}
      else if(stonesInQuarry>=1 && stonesInSled==4){howMany=1;}
      else{
        this.showSnackbarMessage("you can not take stones from the quarry")
        return;
      }

      //change numbers
      this.game.topLeft_quarryStones-=howMany;
      this.game.topLeft_sledStones+=howMany;
      this.topLeftComponent.quarryStones-=howMany;
      this.topLeftComponent.sledStones+=howMany;

    }
    else if(playerField===ColourEnum.brown){
      stonesInQuarry=this.game.topRight_quarryStones;
      stonesInSled=this.game.topRight_sledStones;

      if(stonesInQuarry>=3 && stonesInSled<=2){howMany=3;}
      else if(stonesInQuarry==2 && stonesInSled<=2){howMany=2;}
      else if(stonesInQuarry==1 && stonesInSled<=2){howMany=1;}
      else if(stonesInQuarry>=2 && stonesInSled==3){howMany=2;}
      else if(stonesInQuarry==1 && stonesInSled==3){howMany=1;}
      else if(stonesInQuarry>=1 && stonesInSled==4){howMany=1;}
      else{
        this.showSnackbarMessage("you can not take stones from the quarry")
        return;
      }

      //change numbers
      this.game.topRight_quarryStones-=howMany;
      this.game.topRight_sledStones+=howMany;
      this.topRightComponent.quarryStones-=howMany;
      this.topRightComponent.sledStones+=howMany;

    }
    else if(playerField===ColourEnum.gray){
      stonesInQuarry=this.game.bottomRight_quarryStones;
      stonesInSled=this.game.bottomRight_sledStones;

      if(stonesInQuarry>=3 && stonesInSled<=2){howMany=3;}
      else if(stonesInQuarry==2 && stonesInSled<=2){howMany=2;}
      else if(stonesInQuarry==1 && stonesInSled<=2){howMany=1;}
      else if(stonesInQuarry>=2 && stonesInSled==3){howMany=2;}
      else if(stonesInQuarry==1 && stonesInSled==3){howMany=1;}
      else if(stonesInQuarry>=1 && stonesInSled==4){howMany=1;}
      else{
        this.showSnackbarMessage("you can not take stones from the quarry");
        return;
      }

      //change numbers
      this.game.bottomRight_quarryStones-=howMany;
      this.game.bottomRight_sledStones+=howMany;
      this.bottomRightComponent.quarryStones-=howMany;
      this.bottomRightComponent.sledStones+=howMany;

    }

    //generate decision object
    let newDecision:Decision = new Decision();
    newDecision.decisionMadeBy=this.game.myPlayerField;
    newDecision.whoMadeWhatDecisionSnackbarMessage=this.game.myPlayerField+
      " took "+ howMany +" stone from quarry.";
    newDecision.madeAction= new Action();
    newDecision.madeAction.actionName=ActionEnum.fillSledWithStonesFromQuarry;
    newDecision.madeAction.madeMove= new Move();
    newDecision.madeAction.madeMove.from=PositionEnum.stoneQuarry;
    newDecision.madeAction.madeMove.to=PositionEnum.supplySled;

    if(this.game.myPlayerField===ColourEnum.black){
      newDecision.id[1]+=1;
    }
    else if(this.game.myPlayerField===ColourEnum.white){
      newDecision.id[2]+=1;
    }
    else if(this.game.myPlayerField===ColourEnum.brown){
      newDecision.id[3]+=1;
    }
    else if(this.game.myPlayerField===ColourEnum.gray){
      newDecision.id[4]+=1;
    }

    //store own decision object in game model
    this.game.ownDecisions.push(newDecision);


    //send decision object to backend
    //ToDo: Communication Channel to Backend


    //snackbar message
    this.showSnackbarMessage("you took "+ howMany+" stones from the quarry");


    if(1){console.log("take stones from Quarry to Sled:howMany ",howMany);}

    if(1){console.log("take stones from Quarry to Sled:game.quarryStones ",this.game.bottomLeft_quarryStones);}
    if(1){console.log("take stones from Quarry to Sled:game.sledStones ",this.game.bottomLeft_sledStones);}
    if(1){console.log("take stones from Quarry to Sled:Component.quarryStones ",this.bottomLeftComponent.quarryStones);}
    if(1){console.log("take stones from Quarry to Sled:Component.sledStones ",this.bottomLeftComponent.sledStones);}

  }




  //===========================================================
  // Main Action 2: move stone from sled to shipSlot
  //===========================================================

  moveStoneFromSledToShipSlot(){

    //listen to drop of stone on ship slot

    ActionEnum.placeStoneFromSledToShip

    //generate decision object

    //send decision object to backend



    //snackbar message
    this.showSnackbarMessage("you moved stone from sled to shipSlot ");

  }



  //===========================================================
  // Main Action 3: move ship to site
  //===========================================================


  //=================
  // Sail to Pyramids
  //=================
  moveShipToPyramids(whichShip:number, stonesToMove:Stone[]){

    //called from dragula_subscribeDropEvent()
    if(1){console.log("moveShipToPyramids: whichShip, stonesToMove: ",whichShip, stonesToMove);}

    //generate decision object
    let newDecision:Decision = new Decision();
    newDecision.decisionMadeBy=this.game.myPlayerField;
    newDecision.whoMadeWhatDecisionSnackbarMessage=this.game.myPlayerField +
      " sailed ship "+ whichShip +" to pyramids.";
    newDecision.madeAction= new Action();
    newDecision.madeAction.actionName=ActionEnum.sailShip;
    newDecision.madeAction.actionName2=ActionEnum.sailShipToPyramid;
    newDecision.madeAction.madeMove= new Move();

    if(whichShip==1){
      newDecision.madeAction.madeMove.from=PositionEnum.departingHarbour1;
    }
    else if(whichShip==2){
      newDecision.madeAction.madeMove.from=PositionEnum.departingHarbour2;
    }
    else if(whichShip==3){
      newDecision.madeAction.madeMove.from=PositionEnum.departingHarbour3;
    }
    else if(whichShip==4){
      newDecision.madeAction.madeMove.from=PositionEnum.departingHarbour4;
    }

    if(this.game.myPlayerField===ColourEnum.black){
      newDecision.id[1]+=1;
    }
    else if(this.game.myPlayerField===ColourEnum.white){
      newDecision.id[2]+=1;
    }
    else if(this.game.myPlayerField===ColourEnum.brown){
      newDecision.id[3]+=1;
    }
    else if(this.game.myPlayerField===ColourEnum.gray){
      newDecision.id[4]+=1;
    }

    newDecision.madeAction.madeMove.to=PositionEnum.arrivingHarbour1;

    //store own decision object in game model
    this.game.ownDecisions.push(newDecision);


    //send decision object to backend
    //ToDo: Communication Channel to Backend


    //snackbar message
    this.showSnackbarMessage("you sailed ship "+ whichShip +" to pyramids.");

  }


  //=================
  // Sail to Temple
  //=================

  templeComponent_onEvent_placeStones_stones(data:Stone[]){
    this.game.stonesInTemple=data;
  };

  templeComponent_onEvent_placeStones_totalStones(data:number){
    this.game.totalStonesInTemple=data;
  };

  templeComponent_onEvent_placeStones_fieldHeight(data:number[]){
    this.game.fieldHeightInTemple=data;
  };


  moveShipToTemple(whichShip:number, stonesToMove:Stone[]){

    //called from dragula_subscribeDropEvent()
    if(1){console.log("moveShipToTemple: whichShip, stonesToMove: ",whichShip, stonesToMove);}

    //generate decision object
    let newDecision:Decision = new Decision();
    newDecision.decisionMadeBy=this.game.myPlayerField;
    newDecision.whoMadeWhatDecisionSnackbarMessage=this.game.myPlayerField+
      " sailed ship "+ whichShip +" to temple.";
    newDecision.madeAction= new Action();
    newDecision.madeAction.actionName=ActionEnum.sailShip;
    newDecision.madeAction.actionName2=ActionEnum.sailShipToTemple;
    newDecision.madeAction.madeMove= new Move();

    if(whichShip==1){
      newDecision.madeAction.madeMove.from=PositionEnum.departingHarbour1;
    }
    else if(whichShip==2){
      newDecision.madeAction.madeMove.from=PositionEnum.departingHarbour2;
    }
    else if(whichShip==3){
      newDecision.madeAction.madeMove.from=PositionEnum.departingHarbour3;
    }
    else if(whichShip==4){
      newDecision.madeAction.madeMove.from=PositionEnum.departingHarbour4;
    }

    if(this.game.myPlayerField===ColourEnum.black){
      newDecision.id[1]+=1;
    }
    else if(this.game.myPlayerField===ColourEnum.white){
      newDecision.id[2]+=1;
    }
    else if(this.game.myPlayerField===ColourEnum.brown){
      newDecision.id[3]+=1;
    }
    else if(this.game.myPlayerField===ColourEnum.gray){
      newDecision.id[4]+=1;
    }

    newDecision.madeAction.madeMove.to=PositionEnum.arrivingHarbour2;

    //store own decision object in game model
    this.game.ownDecisions.push(newDecision);


    //send decision object to backend
    //ToDo: Communication Channel to Backend


    //snackbar message
    this.showSnackbarMessage("you sailed ship "+ whichShip +" to temple.");

  }

  //======================
  // Sail to BurialChamber
  //======================

  moveShipToBurialChamber(whichShip:number, stonesToMove:Stone[]){

    //called from dragula_subscribeDropEvent()
    if(1){console.log("moveShipToBurialChamber: whichShip, stonesToMove: ",whichShip, stonesToMove);}

    //generate decision object
    let newDecision:Decision = new Decision();
    newDecision.decisionMadeBy=this.game.myPlayerField;
    newDecision.whoMadeWhatDecisionSnackbarMessage=this.game.myPlayerField+
      " sailed ship "+ whichShip +" to burial chamber.";
    newDecision.madeAction= new Action();
    newDecision.madeAction.actionName=ActionEnum.sailShip;
    newDecision.madeAction.actionName2=ActionEnum.sailShipToBurialChamber;
    newDecision.madeAction.madeMove= new Move();

    if(whichShip==1){
      newDecision.madeAction.madeMove.from=PositionEnum.departingHarbour1;
    }
    else if(whichShip==2){
      newDecision.madeAction.madeMove.from=PositionEnum.departingHarbour2;
    }
    else if(whichShip==3){
      newDecision.madeAction.madeMove.from=PositionEnum.departingHarbour3;
    }
    else if(whichShip==4){
      newDecision.madeAction.madeMove.from=PositionEnum.departingHarbour4;
    }

    if(this.game.myPlayerField===ColourEnum.black){
      newDecision.id[1]+=1;
    }
    else if(this.game.myPlayerField===ColourEnum.white){
      newDecision.id[2]+=1;
    }
    else if(this.game.myPlayerField===ColourEnum.brown){
      newDecision.id[3]+=1;
    }
    else if(this.game.myPlayerField===ColourEnum.gray){
      newDecision.id[4]+=1;
    }

    newDecision.madeAction.madeMove.to=PositionEnum.arrivingHarbour3;

    //store own decision object in game model
    this.game.ownDecisions.push(newDecision);


    //send decision object to backend
    //ToDo: Communication Channel to Backend

    //snackbar message
    this.showSnackbarMessage("you sailed ship "+ whichShip +" to burial chamber.");

  }

  //=================
  // Sail to Obelisk
  //=================

  obeliskComponent_onEvent_placeStones_stones(data:number[]){

    console.log("data from obeliskComponent",data);

    //store data into Game Model
    this.game.stonesInObelisk=data;

    console.log("data from Game Model",this.game.stonesInObelisk);

  };

  moveShipToObelisks(whichShip:number, stonesToMove:Stone[]){

    //called from dragula_subscribeDropEvent()
    if(1){console.log("moveShipToObelisks: whichShip, stonesToMove: ",whichShip, stonesToMove);}

    //generate decision object
    let newDecision:Decision = new Decision();
    newDecision.decisionMadeBy=this.game.myPlayerField;
    newDecision.whoMadeWhatDecisionSnackbarMessage=this.game.myPlayerField+
      " sailed ship "+ whichShip +" to obelisks.";
    newDecision.madeAction= new Action();
    newDecision.madeAction.actionName=ActionEnum.sailShip;
    newDecision.madeAction.actionName2=ActionEnum.sailShipToObelisk;
    newDecision.madeAction.madeMove= new Move();

    if(whichShip==1){
      newDecision.madeAction.madeMove.from=PositionEnum.departingHarbour1;
    }
    else if(whichShip==2){
      newDecision.madeAction.madeMove.from=PositionEnum.departingHarbour2;
    }
    else if(whichShip==3){
      newDecision.madeAction.madeMove.from=PositionEnum.departingHarbour3;
    }
    else if(whichShip==4){
      newDecision.madeAction.madeMove.from=PositionEnum.departingHarbour4;
    }

    if(this.game.myPlayerField===ColourEnum.black){
      newDecision.id[1]+=1;
    }
    else if(this.game.myPlayerField===ColourEnum.white){
      newDecision.id[2]+=1;
    }
    else if(this.game.myPlayerField===ColourEnum.brown){
      newDecision.id[3]+=1;
    }
    else if(this.game.myPlayerField===ColourEnum.gray){
      newDecision.id[4]+=1;
    }

    newDecision.madeAction.madeMove.to=PositionEnum.arrivingHarbour4;

    //store own decision object in game model
    this.game.ownDecisions.push(newDecision);


    //send decision object to backend
    //ToDo: Communication Channel to Backend

    //snackbar message
    this.showSnackbarMessage("you sailed ship "+ whichShip +" to obelisks.");


  }

  //=================
  // Sail to Market
  //=================

  moveShipToMarket(whichShip:number, stonesToMove:Stone[]){

    //called from dragula_subscribeDropEvent()
    if(1){console.log("moveShipToMarket: whichShip, stonesToMove: ",whichShip, stonesToMove);}

    //generate decision object
    let newDecision:Decision = new Decision();
    newDecision.decisionMadeBy=this.game.myPlayerField;
    newDecision.whoMadeWhatDecisionSnackbarMessage=this.game.myPlayerField+
      " sailed ship "+ whichShip +" to market.";
    newDecision.madeAction= new Action();
    newDecision.madeAction.actionName=ActionEnum.sailShip;
    newDecision.madeAction.actionName2=ActionEnum.sailShipToMarket;
    newDecision.madeAction.madeMove= new Move();

    if(whichShip==1){
      newDecision.madeAction.madeMove.from=PositionEnum.departingHarbour1;
    }
    else if(whichShip==2){
      newDecision.madeAction.madeMove.from=PositionEnum.departingHarbour2;
    }
    else if(whichShip==3){
      newDecision.madeAction.madeMove.from=PositionEnum.departingHarbour3;
    }
    else if(whichShip==4){
      newDecision.madeAction.madeMove.from=PositionEnum.departingHarbour4;
    }

    if(this.game.myPlayerField===ColourEnum.black){
      newDecision.id[1]+=1;
    }
    else if(this.game.myPlayerField===ColourEnum.white){
      newDecision.id[2]+=1;
    }
    else if(this.game.myPlayerField===ColourEnum.brown){
      newDecision.id[3]+=1;
    }
    else if(this.game.myPlayerField===ColourEnum.gray){
      newDecision.id[4]+=1;
    }

    newDecision.madeAction.madeMove.to=PositionEnum.arrivingHarbour5;

    //store own decision object in game model
    this.game.ownDecisions.push(newDecision);


    //send decision object to backend
    //ToDo: Communication Channel to Backend

    //snackbar message
    this.showSnackbarMessage("you sailed ship "+ whichShip +" to market.");

  }


  //===========================================================
  // Main Action 4: take market card
  //===========================================================

  marketComponent_onEvent_setClickHandlerOnMarketCards_1_marketCards(data:MarketCard[]){
    if(1){console.log("marketCards 1: data: ",data);}
    if (data[0].colour=="red"){
      this.takeRedMarketCardFromMarket(data);
    }
    else{
      this.takeNotRedMarketCardFromMarket(data);
    }
  }

  marketComponent_onEvent_setClickHandlerOnMarketCards_2_marketCards(data:MarketCard[]){
    if(1){console.log("marketCards 2: data: ",data);}
    if (data[1].colour=="red"){
      this.takeRedMarketCardFromMarket(data);
    }
    else{
      this.takeNotRedMarketCardFromMarket(data);
    }
  }
  marketComponent_onEvent_setClickHandlerOnMarketCards_3_marketCards(data:MarketCard[]){
    if(1){console.log("marketCards 3: data: ",data);}
    if (data[2].colour=="red"){
      this.takeRedMarketCardFromMarket(data);
    }
    else{
      this.takeNotRedMarketCardFromMarket(data);
    }
  }
  marketComponent_onEvent_setClickHandlerOnMarketCards_4_marketCards(data:MarketCard[]){
    if(1){console.log("marketCards 4: data: ",data);}
    if (data[3].colour=="red"){
      this.takeRedMarketCardFromMarket(data);
    }
    else{
      this.takeNotRedMarketCardFromMarket(data);
    }
  }


  takeRedMarketCardFromMarket(data:MarketCard[]){

    //called from click event in market component
    if(1){console.log("take red market card from market");}

    /**

    //make calculations
    let stonesInQuarry:number;
    let stonesInSled:number;
    let howMany:number;

    if(playerField===ColourEnum.black){
      stonesInQuarry=this.game.bottomLeft_quarryStones;
      stonesInSled=this.game.bottomLeft_sledStones;

      if(stonesInQuarry>=3 && stonesInSled<=2){howMany=3;}
      else if(stonesInQuarry==2 && stonesInSled<=2){howMany=2;}
      else if(stonesInQuarry==1 && stonesInSled<=2){howMany=1;}
      else if(stonesInQuarry>=2 && stonesInSled==3){howMany=2;}
      else if(stonesInQuarry==1 && stonesInSled==3){howMany=1;}
      else if(stonesInQuarry>=1 && stonesInSled==4){howMany=1;}
      else{
        this.showSnackbarMessage("you can not take stones from the quarry")
        return;
      }

      //change numbers
      this.game.bottomLeft_quarryStones-=howMany;
      this.game.bottomLeft_sledStones+=howMany;
      this.bottomLeftComponent.quarryStones-=howMany;
      this.bottomLeftComponent.sledStones+=howMany;


    }
    else if(playerField===ColourEnum.white){
      stonesInQuarry=this.game.topLeft_quarryStones;
      stonesInSled=this.game.topLeft_sledStones;

      if(stonesInQuarry>=3 && stonesInSled<=2){howMany=3;}
      else if(stonesInQuarry==2 && stonesInSled<=2){howMany=2;}
      else if(stonesInQuarry==1 && stonesInSled<=2){howMany=1;}
      else if(stonesInQuarry>=2 && stonesInSled==3){howMany=2;}
      else if(stonesInQuarry==1 && stonesInSled==3){howMany=1;}
      else if(stonesInQuarry>=1 && stonesInSled==4){howMany=1;}
      else{
        this.showSnackbarMessage("you can not take stones from the quarry")
        return;
      }

      //change numbers
      this.game.topLeft_quarryStones-=howMany;
      this.game.topLeft_sledStones+=howMany;
      this.topLeftComponent.quarryStones-=howMany;
      this.topLeftComponent.sledStones+=howMany;

    }
    else if(playerField===ColourEnum.brown){
      stonesInQuarry=this.game.topRight_quarryStones;
      stonesInSled=this.game.topRight_sledStones;

      if(stonesInQuarry>=3 && stonesInSled<=2){howMany=3;}
      else if(stonesInQuarry==2 && stonesInSled<=2){howMany=2;}
      else if(stonesInQuarry==1 && stonesInSled<=2){howMany=1;}
      else if(stonesInQuarry>=2 && stonesInSled==3){howMany=2;}
      else if(stonesInQuarry==1 && stonesInSled==3){howMany=1;}
      else if(stonesInQuarry>=1 && stonesInSled==4){howMany=1;}
      else{
        this.showSnackbarMessage("you can not take stones from the quarry")
        return;
      }

      //change numbers
      this.game.topRight_quarryStones-=howMany;
      this.game.topRight_sledStones+=howMany;
      this.topRightComponent.quarryStones-=howMany;
      this.topRightComponent.sledStones+=howMany;

    }
    else if(playerField===ColourEnum.gray){
      stonesInQuarry=this.game.bottomRight_quarryStones;
      stonesInSled=this.game.bottomRight_sledStones;

      if(stonesInQuarry>=3 && stonesInSled<=2){howMany=3;}
      else if(stonesInQuarry==2 && stonesInSled<=2){howMany=2;}
      else if(stonesInQuarry==1 && stonesInSled<=2){howMany=1;}
      else if(stonesInQuarry>=2 && stonesInSled==3){howMany=2;}
      else if(stonesInQuarry==1 && stonesInSled==3){howMany=1;}
      else if(stonesInQuarry>=1 && stonesInSled==4){howMany=1;}
      else{
        this.showSnackbarMessage("you can not take stones from the quarry");
        return;
      }

      //change numbers
      this.game.bottomRight_quarryStones-=howMany;
      this.game.bottomRight_sledStones+=howMany;
      this.bottomRightComponent.quarryStones-=howMany;
      this.bottomRightComponent.sledStones+=howMany;

    }

    //generate decision object
    let newDecision:Decision = new Decision();
    newDecision.decisionMadeBy=this.game.myPlayerField;
    newDecision.whoMadeWhatDecisionSnackbarMessage=this.game.myPlayerField+
      " took "+ howMany +" stone from quarry.";
    newDecision.madeAction= new Action();
    newDecision.madeAction.actionName=ActionEnum.fillSledWithStonesFromQuarry;
    newDecision.madeAction.madeMove= new Move();
    newDecision.madeAction.madeMove.from=PositionEnum.stoneQuarry;
    newDecision.madeAction.madeMove.to=PositionEnum.supplySled;

    if(this.game.myPlayerField===ColourEnum.black){
      newDecision.id[1]+=1;
    }
    else if(this.game.myPlayerField===ColourEnum.white){
      newDecision.id[2]+=1;
    }
    else if(this.game.myPlayerField===ColourEnum.brown){
      newDecision.id[3]+=1;
    }
    else if(this.game.myPlayerField===ColourEnum.gray){
      newDecision.id[4]+=1;
    }

    //store own decision object in game model
    this.game.ownDecisions.push(newDecision);


    //send decision object to backend
    //ToDo: Communication Channel to Backend


    //snackbar message
    this.showSnackbarMessage("you took "+ howMany+" stones from the quarry");


    if(1){console.log("take stones from Quarry to Sled:howMany ",howMany);}

    if(1){console.log("take stones from Quarry to Sled:game.quarryStones ",this.game.bottomLeft_quarryStones);}
    if(1){console.log("take stones from Quarry to Sled:game.sledStones ",this.game.bottomLeft_sledStones);}
    if(1){console.log("take stones from Quarry to Sled:Component.quarryStones ",this.bottomLeftComponent.quarryStones);}
    if(1){console.log("take stones from Quarry to Sled:Component.sledStones ",this.bottomLeftComponent.sledStones);}



    //(lastDecisionActionName === ActionEnum.sailShip
    //  && (lastDecisionActionName2 === ActionEnum.sailShipToMarket))
*/


  }


  takeNotRedMarketCardFromMarket(data:MarketCard[]){

    //listen to click on market card

    //(lastDecisionActionName === ActionEnum.sailShip
    //  && (lastDecisionActionName2 === ActionEnum.sailShipToMarket))

    //generate decision object

    //send decision object to backend

  }







  //===========================================================
  // Main Action 5: play blue market card
  //===========================================================

  bottomLeftComponent_onEvent_setClickHandlerOnBlueMarketCards_bll_1_marketCards(data:number[]){
    this.game.bottomLeft_marketCards=data;
  }
  bottomLeftComponent_onEvent_setClickHandlerOnBlueMarketCards_bml_1_marketCards(data:number[]){
    this.game.bottomLeft_marketCards=data;
  }
  bottomLeftComponent_onEvent_setClickHandlerOnBlueMarketCards_bmr_1_marketCards(data:number[]){
    this.game.bottomLeft_marketCards=data;
  }
  bottomLeftComponent_onEvent_setClickHandlerOnBlueMarketCards_brr_1_marketCards(data:number[]){
    this.game.bottomLeft_marketCards=data;
  }


  topLeftComponent_onEvent_setClickHandlerOnBlueMarketCards_bll_1_marketCards(data:number[]){
    this.game.topLeft_marketCards=data;
  }
  topLeftComponent_onEvent_setClickHandlerOnBlueMarketCards_bml_1_marketCards(data:number[]){
    this.game.topLeft_marketCards=data;
  }
  topLeftComponent_onEvent_setClickHandlerOnBlueMarketCards_bmr_1_marketCards(data:number[]){
    this.game.topLeft_marketCards=data;
  }
  topLeftComponent_onEvent_setClickHandlerOnBlueMarketCards_brr_1_marketCards(data:number[]){
    this.game.topLeft_marketCards=data;
  }


  topRightComponent_onEvent_setClickHandlerOnBlueMarketCards_bll_1_marketCards(data:number[]){
    this.game.topRight_marketCards=data;
  }
  topRightComponent_onEvent_setClickHandlerOnBlueMarketCards_bml_1_marketCards(data:number[]){
    this.game.topRight_marketCards=data;
  }
  topRightComponent_onEvent_setClickHandlerOnBlueMarketCards_bmr_1_marketCards(data:number[]){
    this.game.topRight_marketCards=data;
  }
  topRighttComponent_onEvent_setClickHandlerOnBlueMarketCards_brr_1_marketCards(data:number[]){
    this.game.topRight_marketCards=data;
  }


  bottomRightComponent_onEvent_setClickHandlerOnBlueMarketCards_bll_1_marketCards(data:number[]){
    this.game.bottomRight_marketCards=data;
  }
  bottomRightComponent_onEvent_setClickHandlerOnBlueMarketCards_bml_1_marketCards(data:number[]){
    this.game.bottomRight_marketCards=data;
  }
  bottomRightComponent_onEvent_setClickHandlerOnBlueMarketCards_bmr_1_marketCards(data:number[]){
    this.game.bottomRight_marketCards=data;
  }
  bottomRightComponent_onEvent_setClickHandlerOnBlueMarketCards_brr_1_marketCards(data:number[]){
    this.game.bottomRight_marketCards=data;
  }


  playBlueMarketCardHammer(){

    //listen to click on market card icon

    //show market card icon in snackbar

    //make move 1

    //generate decision object

    //make move 2

    //generate decision object

    //send decision object to backend

  }

  playBlueMarketCardChisel(){

    //listen to click on market card icon

    //show market card icon in snackbar

    //make move 1

    //generate decision object

    //make move 2

    //generate decision object

    //send decision object to backend


  }

  playBlueMarketCardSail(){

    //listen to click on market card icon

    //show market card icon in snackbar

    //make move 1

    //generate decision object

    //make move 2

    //generate decision object

    //send decision object to backend


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


  }



  /**

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
  this.removeShipFromDepartingHarbour();

  //add ship to arriving harbour
  this.addShipToArrivingHarbour();

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

   //Played Blue Market Card Lever (Sail Ship to left side of island)
   //----------------------------------------------------------------
   else if (lastDecisionActionName === ActionEnum.playBlueMarketCardLever
   && !(lastDecisionActionName2 === ActionEnum.sailShipToMarket)) {

  //update Numbers on PlayerField: Sled
  this.updatePlayerData();

  //remove ship from departing harbour
  this.removeShipFromDepartingHarbour();

  //add ship to arriving harbour
  this.addShipToArrivingHarbour();

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
  this.removeShipFromDepartingHarbour();

  //add ship to arriving harbour
  this.addShipToArrivingHarbour();

  //switch order of stones on ship
  this.switchOrderOfStonesOnShip();

  //show Snackbarinfo
  let text="replace this string"
  this.showSnackbarMessage(text);

}

   */



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
    //this.marketComponent.deactivateOrActivateMarketCards(); //(click)="trigger_deactivateOrActivateMarketCards()"
  }


  // Communication with ShipComponent
  //---------------------------------
  trigger_deactivateOrActivateShips(){

    this.shipComponent.deactivateOrActivateShips();//(click)="trigger_deactivateOrActivateShips()"

  }

  trigger_setClickHandlerOnSlot() {
    //only works via parent, DepatingHarbourComponent or GameComponent
    let slot="ship_2_slot_1";
    this.departingHarbourComponent.setClickHandlerOnStone(slot);
  }

  trigger_removeClickHandlerOnSlot() {
    //only works via parent, DepatingHarbourComponent or GameComponent
    let slot="ship_3_slot_1";
    this.departingHarbourComponent.removeClickHandlerOnStone(slot);
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
    let id=""
    if(this.stoneId<10){
      id="0"+this.stoneId.toString();
    }else{
      id=this.stoneId.toString();
    }
    if(1){console.log("stone id generator: ", id)}
    return id
  }


  //--------------------------------
  //Dragula Drag Event Subscription
  //--------------------------------
  dragula_subscribeDragEvent() {
    this.dragulaService.drag.subscribe((value) => {

      if(0){console.log("5.1.0 dragula-subscribe-drag");}

      if (value){

        //--------------------------
        //get id of arriving harbour
        //--------------------------
        if(value[0] === 'departing_bag'){
          if(0){console.log("5.2.1 ", `drop: ${value[0]}`);}

          //id of harbour
          let departing_harbour_id=value[2].id;
          if(0){console.log("5.2.2 ", `drop: ${value[2].id}`);}


          //do something with it

        }

        //--------------
        //get id of ship
        //--------------
        if(value[0] === 'harbours_bag') {

          //id of site harbour
          let departing_harbour = value[2];

          if(0){console.log("5.3.1 ", `drag: ${value[0]}`);}


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

      if(1){console.log("6.1.0 dragula-subscribe-drop");}
      if(1){console.log(value[0],value[1],value[2])}

      //-------------------------------------------
      //value object not null; otherwise do nothing
      //-------------------------------------------
      if (value[0] && value[1] && value[2]) {


        //----------------------------------------
        //get id of stone slot ('stone_slots_bag')
        //----------------------------------------
        if(value[0] === 'stone_slots_bag'){
          if(0){console.log("6.1.1 ", `drop: ${value[0]}`);}

          //stone slot id
          let stoneSlot=value[2];
          if(0){console.log("6.1.2 ", `drop: ${value[2].id}`);}

        }


        //-----------------------------------
        //set id of stone ('stone_slots_bag')
        //-----------------------------------
        if(value[0] === 'stone_slots_bag'){
          if(0){console.log("6.2.1 ", `drop: ${value[0]}`);}

          //<app-stone>-tag as html string; there should only be one child [0]
          let appStone=value[1];
          if(0){console.log("6.2.2 ", `drop: ${value[1].children[0].className}`);}
          if(0){console.log("6.2.3 ", `drop: ${value[1].children[0].id}`);}

          //stoneDiv-tag
          let stoneDiv=value[1].children[0];
          if(0){console.log("6.2.4 ", `drop: ${value[1].children[0].className}`);}
          if(0){console.log("6.2.5 ", `drop: ${value[1].children[0].id}`);}

          //set stone id in DOM (unique id, starting from 1)
          //------------------------------------------------

          //call function in GameComponent
          let newStoneId:string=this.generateStoneId();


          //determine ship and slot
          let stoneSlotId=value[2].id

          //determine stone colour
          let stoneClass=value[1].children[0].className;
          let stoneColour=stoneClass.trim().substring(15,17);

          //set attribute id in Dom
          stoneDiv.setAttribute("id", stoneSlotId+"_"+stoneColour+"_dragulaId_"+newStoneId)
          if(0){console.log("6.2.6 ", `drop: ${value[1].children[0].id}`);}

        }

        //----------------------------------------
        //(Buggy-Dragula Fix)
        //If this drop event is triggered
        // make sure the stone is placed into the slot
        // even if it falls back into the sled
        //We switched to Angular 2 style
        // ('stone_slots_bag')
        //----------------------------------------
        if(value[0] === 'stone_slots_bag'){
          if(0){console.log("6.3.1 ", `drop: ${value[0]}`);}

          //stone slot id
          let stoneSlot=value[2];
          if(0){console.log("6.3.2 ", `drop: ${value[2].id}`);}

          //<app-stone>-tag
          let appStone=value[1];
          let stoneDiv=value[1].children[0];
          if(0){console.log("6.3.3 ", `drop: ${value[1].children[0].id}`);}

          if(stoneSlot.children[0]){
            if(0){console.log("6.3.4 ", `drop: stone is in slot`);}
            if(0){console.log("6.3.5 ", `drop: ${stoneSlot.children[0].id}`);}
            if(0){console.log("6.3.6 ", `drop: ${stoneSlot.children[0].class}`);}
            stoneSlot.removeChild(appStone); //added: new version angular 2 style
          }else{
            if(0){console.log("6.3.7 ", `drop: stone is back in sled`);}
            //stoneSlot.appendChild(appStone); //removed: new version angular 2 style
          }

          //--------------------------------------------
          //call add stone to ship (angular 2 style)
          //--------------------------------------------
          this.departingHarbourComponent.addStoneToShip(stoneDiv.id);

        }




        //-------------------------------------------
        //get id of arriving harbour ('harbours_bag')
        //-------------------------------------------
        if(value[0] === 'harbours_bag'){
          if(0){console.log("6.3.1 ", `drop: ${value[0]}`);}

          //id of harbour
          let arriving_harbour_id=value[2].id;
          if(0){console.log("6.3.2 ", `drop: ${value[2].id}`);}


          //do something with it


        }


        //--------------------------------------------
        //call move stone from ship to site
        //--------------------------------------------
        if(value[0] === 'harbours_bag'){

          let leverPlayed = this.playedBlueMarketCard_lever;

          if (leverPlayed) {
            if (1) {console.log("6.5.1 add stone to site manually", `drop: leverPlayed:  ${leverPlayed}`);}

          }
          else {
            if (1) {console.log("6.5.2 add stone to site automatically", `drop: lever Played: ${leverPlayed}`);}

            //Determine which ship sailed
            //---------------------------
            let shipDiv_;
            shipDiv_=value[1].children[0].children[0];
            let shipId=shipDiv_.id;
            let whichShip=Number(shipId.substring(5,6));

            if(1){console.log("shipId, whichShip",shipId, whichShip)}

            //Determine which arriving harbour ship sailed to
            //-----------------------------------------------
            let arrivingHarbour_;
            arrivingHarbour_=value[2];
            let arrivingHarbourId=arrivingHarbour_.id;
            let whichArrivingHarbour=Number(arrivingHarbourId.substring(17,18));

            if(1){console.log("arrivingHarbourId, whichArrivingHarbour",arrivingHarbourId, whichArrivingHarbour)}

            //get stone array on ship
            //-----------------------
            let stonesToMove=new Array<Stone>();
            stonesToMove=this.departingHarbourComponent.passStonesToSite(whichShip);


            //Move stones to correct site
            //---------------------------
            if (whichArrivingHarbour==1){

              //Delete Stones on ship
              this.departingHarbourComponent.emptyStoneArray(whichShip);

              //Place Stones on site
              this.pyramidComponent.placeStones(stonesToMove);

              //Make Decision Object
              this.moveShipToPyramids(whichShip, stonesToMove);

            }
            if (whichArrivingHarbour==2){

              //Delete Stones on ship
              this.departingHarbourComponent.emptyStoneArray(whichShip);

              //Place Stones on site
              this.templeComponent.placeStones(stonesToMove);

              //Make Decision Object
              this.moveShipToTemple(whichShip, stonesToMove);

            }
            if (whichArrivingHarbour==3){

              //Delete Stones on ship
              this.departingHarbourComponent.emptyStoneArray(whichShip);

              //Place Stones on site
              this.burialChamberComponent.placeStones(stonesToMove);

              //Make Decision Object
              this.moveShipToBurialChamber(whichShip, stonesToMove);

            }
            if (whichArrivingHarbour==4){

              //Delete Stones on ship
              this.departingHarbourComponent.emptyStoneArray(whichShip);

              //Place Stones on site
              this.obeliskComponent.placeStones(stonesToMove);

              //Make Decision Object
              this.moveShipToObelisks(whichShip, stonesToMove);

            }
            if (whichArrivingHarbour==5){

              //Delete Stones on ship
              this.departingHarbourComponent.emptyStoneArray(whichShip);

              //Make Decision Object
              this.moveShipToMarket(whichShip, stonesToMove);

            }

          }
          //End: call add stone to site
        }

      }

    });
  }




  //-----------------------------------
  //Draguala Ship Movement Set Options
  //-----------------------------------
  dragulaShipMovement_setOptions(amI_CurrentActivePlayer:boolean){

    //-----------------------------------
    //Options for the currentActivePlayer
    //he has all options acc. to the rules
    //-----------------------------------
    if (amI_CurrentActivePlayer){

      this.dragulaService.setOptions('harbours_bag', {

        accepts: function (el, target, source, sibling) {

          /*where drop is allowed*/

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

            if(0){console.log("10.11.1 dragula-invalid", `isDepartingHarbour: ${isDepartingHarbour}`);};
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
                let divShip_divSlots = el.children[0].children[0];
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
                if(1){console.log("10.11.8 dragula-invalid", el)};
                if(1){console.log("10.11.8 dragula-invalid", el.children[0].children[0])};
                if(1){console.log("10.11.8 dragula-invalid", `countSlots: ${countSlots}`);}


                //count stones
                let countStones:number=0;
                if(divShip_divSlots.children[0]){
                  if(divShip_divSlots.children[0].children[0] && divShip_divSlots.children[0].children[0].children[0]){countStones+=1;}
                }
                if(divShip_divSlots.children[1]){
                  if(divShip_divSlots.children[1].children[0] && divShip_divSlots.children[1].children[0].children[0]){countStones+=1;}
                }
                if(divShip_divSlots.children[2]){
                  if(divShip_divSlots.children[2].children[0] && divShip_divSlots.children[2].children[0].children[0]){countStones+=1;}
                }
                if(divShip_divSlots.children[3]){
                  if(divShip_divSlots.children[3].children[0] && divShip_divSlots.children[3].children[0].children[0]){countStones+=1;}
                }
                if(1){console.log("10.11.9 dragula-invalid", `countStones: ${countStones}`);};


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

                if(1){console.log("10.11.11 dragula-invalid", `isInvalid : ${isInvalid}`);};
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
              if(0){console.log("10.12.1 dragula-invalid", "---ArrivingHarbour (True=drag disallowed)---");}
              return true;
            }
            else {
                if(0){console.log("10.12.2 dragula-invalid", "---ArrivingHarbour (False=drag allowed)---");}
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

  dragulaStoneMovement_setOptions(amI_CurrentActivePlayer:boolean){

    //-----------------------------------
    //Options for the currentActivePlayer
    //-----------------------------------
    if (amI_CurrentActivePlayer){

      this.dragulaService.setOptions('stone_slots_bag', {

        accepts: function (el, target, source, sibling) {

          /*where drop is allowed*/

          if(0){console.log("stone_slots_bag:accepts ", `el: ${el}`);
          console.log("stone_slots_bag:accepts ", `source: ${source}`);
          console.log("stone_slots_bag:accepts ", `target: ${target}`);
          console.log("stone_slots_bag:accepts ", `sibling: ${sibling}`);}

          if(0){console.log("stone_slots_bag:accepts ", el.id, target.id,
            source.id, target.children[0])};

          if (el && target && source){

            //let isEmpty = target.innerHTML === ""; //old version
            //let isEmpty = target.children[0]=== null; //does not work out

            //target is class ship_slot or id ship_i_slot_j
            let isEmpty = target.innerHTML.substring(target.innerHTML.length - 3, target.innerHTML.length)==='-->';
            let isStoneSlot_1 = target.parentElement.id === "ship_1_slots";
            let isStoneSlot_2 = target.parentElement.id === "ship_2_slots";
            let isStoneSlot_3 = target.parentElement.id === "ship_3_slots";
            let isStoneSlot_4 = target.parentElement.id === "ship_4_slots";


            if(0){console.log("11.1.0 ",target.innerHTML.substring(target.innerHTML.length - 3, target.innerHTML.length))}
            if(0){console.log("11.1.0 ",target.innerHTML.substring(target.innerHTML.length - 3, target.innerHTML.length)==='-->')}

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
                if(0){console.log("11.6.2 dragula-accepts:", "---ship slots (False=drop disallowed)---");}
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

            if(0){console.log("stone_slots_bag:invalid ", el.id, el.parentElement.id,
                    el.parentElement.parentElement.id, el.parentElement.parentElement.parentElement.id)};


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
