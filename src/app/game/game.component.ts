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
              private _ngZone: NgZone) {

    this.dragulaShipMovement_setOptions();
    this.dragulaStoneMovement_setOptions();
    this.dragula_subscribeDragEvent();
    this.dragula_subscribeDropEvent();


  }

  //==========
  // ngOnInit
  //==========

  ngOnInit() {
    this.stones_target.push(this.stone1);
    this.stones_target.push(this.stone2);
    this.stones_target.push(this.stone3);
    this.stones_target.push(this.stone4);

    //snackbar
    this.generateSnackbarDiv();

  }


  //================
  // ngAfterViewInit
  //================

  ngAfterViewInit() {



  }



  //==============================
  // Major Tasks of Game Component
  //==============================

  // Current Game state
  // ( current-game-state package from backend sent to all players)
  //---------------------------------------------------------------
  //1. pull current-target-game-state package from game-service,
  //   store it into object of class current-game-state.ts

  //2. make current-actual-game-state package from frontend,
  //   store it into object of class current-game-state.ts

  //3. compare actual/target game-state,
  //   delegate differences to ancestors to fix

  // Last players move/action/decision
  // ( decision package from backend sent to not active players)
  //------------------------------------------------------------
  //1. pull last players decision from game-service,
  //   store it into object of class decision.ts

  //2. Simulate last decision to other players
  //   delegate task to ancestors

  // Current active Player
  //----------------------
  //1. pull active Player information from game-service
  //   store it into object of class user

  //2. Delegate information to descendant,
  //   to visually highlight active player field

  // Allowed moves/actions/decisions
  // ( decision package from backend sent to active player,
  // (to not active players as info))
  //-------------------------------------------------------
  //1. pull allowed players decisions from game-service,
  //   store it into object of class decision.ts

  //2. Delegate information to descendants,
  //   to activate allowed actions/moves and invalidate all others.

  // Active player move/action/decision
  // (decision package from active player sent to backend)
  //------------------------------------------------------
  //1. pull active player's decision from ancestor components

  //2. store active player's decision into object of class decision.ts

  //3. push active player decision to game-service



  //===========================================================
  // Test-Data: Instantiate fake data as input for test-methods
  //===========================================================

  //will later be fields of defined class variables above
  playerName_target:string="P1: Roland";
  marketCards_target:number[]=[1,0,2,0,1,1,0,0,4];
  score_target:number=12;
  sledStones_target:number=3;
  quarryStones_target:number=25;
  playerIconsStatus_target:boolean[]=[false, false, false, true, false, true, false, false, false];
  playerStoneQuarryStatus_target:boolean=false;
  playerStoneSledStatus_target:boolean=false;
  playerPlayerFieldStatus_target:boolean=false;
  roundNumber:number=3;


  //Fake Ships
  ship1 = new Ship(1, 4);
  ship2 = new Ship(2, 3);
  ship3 = new Ship(3, 2);
  ship4 = new Ship(4, 1);

  //Fake Stones
  stone1 = new Stone(1, ColourEnum.brown);
  stone2 = new Stone(2, ColourEnum.white);
  stone3 = new Stone(3, ColourEnum.gray);
  stone4 = new Stone(4, ColourEnum.black);
  stones_target = new Array<Stone>();

  //-----------
  //stones flow (do not generate stones outside of quarry and sled at game init!)
  //-----------
  //1. stone quarry (source 1)
  //2. supply sled (source2)
  //3. to ship slot
  //4. to site slot
  //5. back to quarry
  //-----------


  //Fake Players
  //1: white, 2:gray, 3:black, 4:brown
  Player1_myself= new User(1);
  player2= new User(2);
  player3= new User(3);
  player4= new User(4);


  //==================================================
  // Initialize Game
  //==================================================

  initGame(){

    //Game id
    let id_:number=1;

    //Game name
    let name_:string= "Roland_David_Kenny_Vincent"

    //Number of players
    let numPlayers_:number=4;
    let player1:User= new User(1, "Roland", "brown");
    let player2:User= new User(2, "David", "white");
    let player3:User= new User(3, "Kenny", "gray");
    let player4:User= new User(4, "Vincent", "black");
    let players_:User[];
    players_.push(player1);
    players_.push(player2);
    players_.push(player3);
    players_.push(player4);

    //current active player
    let currentPlayer_:string=player1.username;

    //Stone quarry with stone objects (do not generate more stones elsewhere)
    let stoneQuarry1:StoneQuarry = new StoneQuarry(27,3,ColourEnum.brown,player1);
    let stoneQuarry2:StoneQuarry = new StoneQuarry(26,34,ColourEnum.brown,player2);
    let stoneQuarry3:StoneQuarry = new StoneQuarry(25,65,ColourEnum.brown,player3);
    let stoneQuarry4:StoneQuarry = new StoneQuarry(24,96,ColourEnum.brown,player4);

    //Stone quarry with stone objects (do not generate more stones elsewhere)
    let stoneSled1:SupplySled = new SupplySled(2,1,ColourEnum.brown,player1);
    let stoneSled2:SupplySled = new SupplySled(3,31,ColourEnum.white,player2);
    let stoneSled3:SupplySled = new SupplySled(4,61,ColourEnum.gray,player3);
    let stoneSled4:SupplySled = new SupplySled(5,91,ColourEnum.black,player4);

    // sites
    let obelisk:Obelisk;
    let pyramid:Pyramid;
    let temple:Temple;
    let market:Market;
    let burialChamber:BurialChamber;

  }


  //==================================================
  // Initialize New Round
  //==================================================

  initRound(){


  }



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

    this.bottomLeftComponent.deactivateOrActivateStoneSled(this.playerStoneSledStatus_target); //(click)="trigger_deactivateOrActivateStoneQuarry()"
    this.bottomRightComponent.deactivateOrActivateStoneSled(this.playerStoneSledStatus_target); //(click)="trigger_deactivateOrActivateStoneQuarry()"
    this.topLeftComponent.deactivateOrActivateStoneSled(this.playerStoneSledStatus_target); //(click)="trigger_deactivateOrActivateStoneQuarry()"
    this.topRightComponent.deactivateOrActivateStoneSled(this.playerStoneSledStatus_target); //(click)="trigger_deactivateOrActivateStoneQuarry()"

  }

  trigger_deactivateOrActivatePlayerField(){

    this.bottomLeftComponent.deactivateOrActivatePlayerField(this.playerPlayerFieldStatus_target); //(click)="trigger_deactivateOrActivateStoneQuarry()"
    this.bottomRightComponent.deactivateOrActivatePlayerField(this.playerPlayerFieldStatus_target); //(click)="trigger_deactivateOrActivateStoneQuarry()"
    this.topLeftComponent.deactivateOrActivatePlayerField(this.playerPlayerFieldStatus_target); //(click)="trigger_deactivateOrActivateStoneQuarry()"
    this.topRightComponent.deactivateOrActivatePlayerField(this.playerPlayerFieldStatus_target); //(click)="trigger_deactivateOrActivateStoneQuarry()"

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
    this.departingHarbourComponent.generateFourShips(this.ship1,this.ship2,this.ship3,this.ship4); //(click)="trigger_generateFourShips()"
  }

  trigger_generateShip(){
    this.departingHarbourComponent.generateShip(this.ship1); //(click)="trigger_generateShip()"
  }

  trigger_removeShip(id:number){
    this.departingHarbourComponent.removeShip(this.ship4); //(click)="trigger_removeShip()"
  }


  // Communication with SiteHarbour
  //-------------------------------


  // Communication with MaketHarbour
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
    this.marketComponent.generateFourMarketCards(); //(click)="trigger_generateFourMarketCards()"
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


  // Communication with InfoBoxComponent
  //---------------------------------
  trigger_increaseRoundInInfoBox(){

    this.infoBoxComponent.increaseRoundInInfoBox(this.roundNumber);//(click)="trigger_increaseRoundInInfoBox()"

  }



  //===================
  // Subscribe-Methods
  //===================






  //===============
  // Other-Methods

  //===============
  trigger_removeAllStones(){
    this.pyramidComponent.removeStones();
    this.templeComponent.removeStones();
    this.burialChamberComponent.removeStones();
    this.obeliskComponent.removeStones();
  }

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

  //------------------
  //stone id generator
  //------------------
  stoneId:number=1;

  generateStoneId(){
    this.stoneId+=1;
    return this.stoneId.toString()
  }



  //================
  // Dragula-Methods
  //================
  dragula_subscribeDragEvent() {
    this.dragulaService.drag.subscribe((value) => {

      if(0){console.log("10.1.0 dragula-subscribe-drag");}

      if (value){


        if(0){console.log("6.1.1.1 ", `drag: ${value}`);
         console.log("6.1.1.2 ", `drag: ${value[0]}`);
         console.log("6.1.1.3 ", `drag: ${value.slice(1)}`);}

        if(0){console.log("10.1.1 dragula-subscribe-drag");}

        //custom code




      }
    });
  }

  dragula_subscribeDropEvent() {
    this.dragulaService.drop.subscribe((value) => {

      console.log("10.1.0 dragula-subscribe-drop");

      //-------------------------------------------
      //value object not null; otherwise do nothing
      //-------------------------------------------
      if (value) {


        //--------------------
        //get id of stone slot
        //--------------------
        if(value[0] === 'stone_slots_bag'){
          if(1){console.log("6.1.1 ", `drop: ${value[0]}`);}

          //stone slot id
          let stone_slot_id=value[2].id;
          if(1){console.log("6.1.2 ", `drop: ${value[2].id}`);}

        }

        //---------------
        //set id of stone
        //---------------
        if(value[0] === 'stone_slots_bag'){
          if(1){console.log("6.2.1 ", `drop: ${value[0]}`);}

          //<app-ship>-tag as html string; there should only be one child [0]
          //id is wrongly set as stone_0 for all stones
          if(1){console.log("6.2.2 ", `drop: ${value[1].children[0].className}`);}
          if(1){console.log("6.2.3 ", `drop: ${value[1].children[0].id}`);}

          //set stone id in DOM (unique id, starting from 1)
          let newStoneId:string=this.generateStoneId();
          value[1].children[0].setAttribute("id",newStoneId)

          //generate stone in Angular model


        }


        //--------------------------
        //get id of arriving harbour
        //--------------------------
        if(value[0] === 'harbours_bag'){
          if(1){console.log("6.3.1 ", `drop: ${value[0]}`);}

          //id of harbour
          let arriving_harbour_id=value[2].id;
          if(1){console.log("6.3.2 ", `drop: ${value[2].id}`);}


          //do something with it


        }

        //--------------
        //get id of ship
        //--------------
        if(value[0] === 'harbours_bag'){
          if(1){console.log("6.4.1 ", `drop: ${value[0]}`);}

          //id of site harbour
          let arriving_harbour_id=value[2].id;

          //what is it?
          if(1){console.log("6.4.2 ", `drop: ${value[1].childNodes[0]}`);}

          //<app-ship>-tag as DOM node; there should only be one child [0]
          let childNodes=document.getElementById(arriving_harbour_id).childNodes;
          if(1){console.log("6.4.3 ", `drop: ${childNodes}`);}
          if(1){console.log("6.4.4 ", `drop: ${childNodes[0].childNodes[0]}`);}

          //<app-ship>-tag as html string; there should only be one child [0]
          let children=document.getElementById(arriving_harbour_id).children;
          if(1){console.log("6.4.5 ", `drop: ${children}`);}
          if(1){console.log("6.4.6 ", `drop: ${children[0].children[0]}`);}

          //
          if(1){console.log("6.4.7 ", `drop: ${children[0].children[0].className}`);}
          if(1){console.log("6.4.8 ", `drop: ${children[0].children[0].id}`);}

        }



      }

    });
  }

  dragulaShipMovement_setOptions(){

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
          return true; //rue: elements are always draggable by default
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
        console.log("harbours_bag:invalid ", `el.parent.parent: ${el.parentElement.parentElement}`);}

        if (el && handle && el.parentElement.parentElement) {

          let isArrivingHarbour = el.parentElement.parentElement.id === "arriving_harbours";
          let isInvalid = isArrivingHarbour;

          if (isInvalid) {
            if(0){console.log("10.10.1 dragula-invalid", "---ArrivingHarbour (True=drag disallowed)---");}
            return true;
          }
          else {
              if(0){console.log("10.10.2 dragula-invalid", "---ArrivingHarbour (False=drag allowed)---");}
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

  dragulaStoneMovement_setOptions(){
    this.dragulaService.setOptions('stone_slots_bag', {

      accepts: function (el, target, source, sibling) {

        /*where drop is allowed*/

        if(0){console.log("stone_slots_bag:accepts ", `el: ${el}`);
        console.log("stone_slots_bag:accepts ", `source: ${source}`);
        console.log("stone_slots_bag:accepts ", `target: ${target}`);
        console.log("stone_slots_bag:accepts ", `sibling: ${sibling}`);}

        if (el && target && source){

          let isEmpty = target.innerHTML === "";
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

        if (el && handle && el.parentElement.parentElement) {

          let isStoneSlot = el.parentElement.parentElement.classList.contains('ship_slots');
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

  // Enable communication with StoneComponent
  @ViewChild(ShipComponent) stoneComponent:ShipComponent;

  // Enable communication with InfoBoxComponent
  @ViewChild(InfoBoxComponent) infoBoxComponent:InfoBoxComponent;






}
