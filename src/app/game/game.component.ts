import {Component, OnInit, ViewChild} from '@angular/core';
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
              private gameService: GameService) {

    this.dragulaShipMovement_setOptions();
    this.dragulaStoneMovement_setOptions();
    this.dragula_subscribeDragEvent();
    this.dragula_subscribeDropEvent();

  }

  //==========
  // ngOnInit
  //==========

  ngOnInit() {


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
  fakeStones:Stone[]=[this.stone1, this.stone2, this.stone3, this.stone4]
  obeliskStones_target:number[]=[1,2,3,4];

  //Fake Ships
  ship1 = new Ship(1, 4);
  ship2 = new Ship(2, 3);
  ship3 = new Ship(3, 2);
  ship4 = new Ship(4, 1);

  //Fake Stones
  stone1 = new Stone(1, 'brown');
  stone2 = new Stone(2, 'brown');
  stone3 = new Stone(3, 'brown');
  stone4 = new Stone(4, 'brown');



  //==================================================
  // Test-Methods: Communication with Child Components
  //==================================================

  // Communication with PlayerComponent or Players ButtomLeftComponent etc. directly
  //--------------------------------------------------------------------------------
  trigger_setPlayerName(){
    this.bottomLeftComponent.setPlayerName(this.playerName_target); //(click)="trigger_setPlayerName()"
  }
  trigger_setMarketCards(){
    this.bottomLeftComponent.setMarketCards(this.marketCards_target); //(click)="trigger_setMarketCards()"
  }
  trigger_setScore(){
    this.bottomLeftComponent.setScore(this.score_target); //(click)="trigger_setScore()"
  }
  trigger_setStonesInSled(){
    this.bottomLeftComponent.setStonesInSled(this.sledStones_target); //(click)="trigger_setStonesInSled()"
  }
  trigger_setStonesInQuarry(){
    this.bottomLeftComponent.setStonesInQuarry(this.quarryStones_target); //(click)="trigger_setStonesInQuarry()"
  }

  // Communication with active player component BottomLeftComponent
  //---------------------------------------------------------------


  // Communication with not active player component BottomLeftComponent
  //-------------------------------------------------------------------


  // Communication with not active player component BottomLeftComponent
  //-------------------------------------------------------------------


  // Communication with not active player component BottomLeftComponent
  //-------------------------------------------------------------------


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


  // Communication with TempleComponent
  //-----------------------------------


  // Communication with BurialChamberComponent
  //------------------------------------------
  trigger_placeStones(){
    this.burialChamberComponent.placeStones(this.fakeStones); //(click)="trigger_setMarketCards()"
  }

  // Communication with ObeliskComponent
  //------------------------------------
  trigger_placeOnObelisk(){
    this.obeliskComponent.increaseStones(this.obeliskStones_target); //(click)="trigger_setMarketCards()"
  }

  // Communication with MarketComponent
  //-----------------------------------
  trigger_removeUnusedMarketCards(){
    this.marketComponent.removeUnusedMarketCards(); //(click)="trigger_removeUnusedMarketCards()"
  }
  trigger_generateFourMarketCards(){
    this.marketComponent.generateFourMarketCards(); //(click)="trigger_generateFourMarketCards()"
  }


  // Communication with ShipComponent
  //---------------------------------





  //================
  // ngAfterViewInit
  //================

  ngAfterViewInit() {

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
  dragula_subscribeDragEvent() {
    this.dragulaService.drag.subscribe((value) => {

      console.log("10.1.0 dragula-subscribe-drag");

      if (value){

        /*Debugging
         console.log("6.1.1.1 ", `drag: ${value}`);
         console.log("6.1.1.2 ", `drag: ${value[0]}`);
         console.log("6.1.1.3 ", `drag: ${value.slice(1)}`);
         */

        //custom code
        console.log("10.1.1 dragula-subscribe-drag");

      }
    });
  }

  dragula_subscribeDropEvent() {
    this.dragulaService.drop.subscribe((value) => {

      console.log("10.1.0 dragula-subscribe-drop");

      if (value) {

         console.log("6.2.1.1 ", `drop: ${value}`);
         console.log("6.2.1.2 ", `drop: ${value[0]}`);
         console.log("6.2.1.3 ", `drop: ${value.slice(1)}`);

        // Custom code here

      }

    });
  }

  dragulaShipMovement_setOptions(){

    this.dragulaService.setOptions('harbours_bag', {

      accepts: function (el, target, source, sibling) {

        /*where drop is allowed*/

        console.log("harbours_bag:accepts ", `el: ${el}`);
        console.log("harbours_bag:accepts ", `source: ${source}`);
        console.log("harbours_bag:accepts ", `target: ${target}`);
        console.log("harbours_bag:accepts ", `sibling: ${sibling}`);

        if (el && target && source){

          let isEmpty = target.innerHTML === "";
          let isArrivingHarbour = target.parentElement.id === "arriving_harbours";


          /*Debugging
           console.log("10.1.1 ", `el: ${el}`); //moved element
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
           console.log("10.5.2 ", "isArrivingHarbour: " ,isArrivingHarbour);
           */

          if (isEmpty && isArrivingHarbour) {
            console.log("10.6.1 dragula-accepts:", "---ArrivingHarbour (True=drop allowed)---");
            return true;
          }
          else {
            console.log("10.6.2 dragula-accepts", "---ArrivingHarbour (False=drop disallowed)---");
            return false;
          }
        }
      },

      moves: function (el, source, handle, sibling) {

        /*element draggable*/

        console.log("harbours_bag:moves ", `el: ${el}`);
        console.log("harbours_bag:moves ", `source: ${source}`);
        console.log("harbours_bag:moves ", `handle: ${handle}`);
        //console.log("harbours_bag:moves ", `sibling: ${sibling}`);

        if (el && source && handle){
          return true; //rue: elements are always draggable by default
        }
        else{
          return false;
        }
      },

      isContainer: function (el) {

        console.log("harbours_bag:iscontainer ", `el: ${el}`);

        if (el) {
          return false;  //only elements in drake.containers will be taken into account
        }
      },

      invalid: function (el, handle) {

        /*where drag is disallowed*/

        console.log("harbours_bag:invalid ", `el: ${el}`);
        console.log("harbours_bag:invalid ", `handle: ${handle}`);
        console.log("harbours_bag:invalid ", `el.parent.parent: ${el.parentElement.parentElement}`);

        if (el && handle && el.parentElement.parentElement) {

          let isArrivingHarbour = el.parentElement.parentElement.id === "arriving_harbours";
          let isInvalid = isArrivingHarbour;

          if (isInvalid) {
            console.log("10.10.1 dragula-invalid", "---ArrivingHarbour (True=drag disallowed)---");
            return true;
          }
          else {
            console.log("10.10.2 dragula-invalid", "---ArrivingHarbour (False=drag allowed)---");
            return false; //false: don't prevent any drags from initiating by default
          }
        }

      },

      direction: 'vertical',  //X (horizontal) or Y axis (vertical) is considered when determining where an element would be dropped

      copy: function (el, source) {

        /*elements are copied or moved*/

        console.log("harbours_bag:copy ", `el: ${el}`);
        console.log("harbours_bag:copy ", `source: ${source}`);

        if (el && source) {

          let isCopyClass = el.classList.contains('you-may-copy-us'); //the css class name
          let isCopyId = el.id === '#you-may-copy-me'; //the css id; but use a className for this

          /*Debugging
           console.log("10.15.1 ", `el.id: ${el.id}`); //moved element
           console.log("10.15.2 ", `el.className: ${el.className}`);
           console.log("10.15.1 ", `el.isCopyClass: ${isCopyClass}`);
           console.log("10.15.2 ", `el.isCopyId: ${isCopyId}`);
           */

          if (isCopyClass || isCopyId) {
            console.log("10.16.1 dragula-accepts", "---ArrivingHarbour (True=copy disallowed)---");
            return true;
          }
          else {
            console.log("10.16.2 dragula-accepts", "---ArrivingHarbour (False=copy disallowed)---");
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

        console.log("stone_slots_bag:accepts ", `el: ${el}`);
        console.log("stone_slots_bag:accepts ", `source: ${source}`);
        console.log("stone_slots_bag:accepts ", `target: ${target}`);
        console.log("stone_slots_bag:accepts ", `sibling: ${sibling}`);

        if (el && target && source){

          let isEmpty = target.innerHTML === "";
          let isStoneSlot_1 = target.parentElement.id === "ship_1_slots";
          let isStoneSlot_2 = target.parentElement.id === "ship_2_slots";
          let isStoneSlot_3 = target.parentElement.id === "ship_3_slots";
          let isStoneSlot_4 = target.parentElement.id === "ship_4_slots";

          /*Debugging:
           console.log("11.1.1 ", `el: ${el}`); //moved element
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
           console.log("11.5.5 ", "isStoneSlot_4: " ,isStoneSlot_4);
           */

          if (isEmpty && (isStoneSlot_1 || isStoneSlot_2 || isStoneSlot_3 || isStoneSlot_4 )) {
            console.log("11.6.1 dragula-accepts:", "---ship slots (True=drop allowed)---");
            return true;
          }
          else {
            console.log("11.6.2 dragula-accepts:", "---ship slots (True=drop allowed)---");
            return false;
          }
        }

      },

      moves: function (el, source, handle, sibling) {

        console.log("stone_slots_bag:moves ", `el: ${el}`);
        console.log("stone_slots_bag:moves ", `source: ${source}`);
        console.log("stone_slots_bag:moves ", `handle: ${handle}`);
        //console.log("stone_slots_bag:moves ", `sibling: ${sibling}`);

        if (el && source && handle) {
          return true; //true: elements are always draggable by default
        }
        else{
          return false;
        }
      },

      isContainer: function (el) {

        console.log("stone_slots_bag:iscontainer ", `el: ${el}`);

        if (el) {
          return false;  //only elements in drake.containers will be taken into account
        }
        else{
          return true;
        }
      },

      invalid: function (el, handle) {

        /*where drag is disallowed*/

        console.log("stone_slots_bag:invalid ", `el: ${el}`);
        console.log("stone_slots_bag:invalid ", `handle: ${handle}`);
        console.log("stone_slots_bag:invalid ", `el.parent.parent: ${el.parentElement.parentElement}`);

        if (el && handle && el.parentElement.parentElement) {

          let isStoneSlot = el.parentElement.parentElement.classList.contains('ship_slots');
          let isInvalid = isStoneSlot;

          if (isInvalid) {
            console.log("10.10.1 dragula-invalid:", "---ship slots (True=drag disallowed)---");
            /**/
            return true;
          }
          else {
            console.log("10.10.2 dragula-invalid:", "---ship slots (False=drag allowed)---");
            /**/
            return false; //false: don't prevent any drags from initiating by default
          }
        }

      },

      direction: 'vertical',  //X (horizontal) or Y axis (vertical) is considered when determining where an element would be dropped

      //copy: true, //false: elements are moved by default, not copied. true: copies el to target and leaves it in source
      copy: function (el, source) {

        /*elements are copied or moved*/

        console.log("stone_slots_bag:copy ", `el: ${el.id}`);
        console.log("stone_slots_bag:copy ", `source: ${source}`);


        if (el && source) {

          let isCopyClass = el.classList.contains('you-may-copy-us'); //the css class name
          let isCopyId = el.id === '#you-may-copy-me'; //the css id; but use a className for this

          /*Debugging
           console.log("11.15.1 ", `el.id: ${el.id}`); //moved element
           console.log("11.15.2 ", `el.className: ${el.className}`);
           console.log("11.15.1 ", `el.isCopyClass: ${isCopyClass}`);
           console.log("11.15.2 ", `el.isCopyId: ${isCopyId}`);
           */

          if (isCopyClass || isCopyId) {
            console.log("11.16.1 dragula-copy:", "---stones (True=copy allowed)---");
            return true;
          }
          else {
            console.log("11.16.2 dragula-copy:", "---stones (False=copy disallowed)---");
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




}
