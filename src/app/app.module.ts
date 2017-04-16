import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { AuthGuardService } from "./shared/services/auth-guard.service";
import { UserService } from "./shared/services/user.service";
import { routing } from "./app.routing";
import { AuthenticationService } from "./shared/services/authentication.service";
import { LoginComponent} from "./login/login.component";
import { GameComponent} from "./game/game.component";
import { HomeComponent } from './home/home.component';
import { LobbyComponent } from './lobby/lobby.component';
import { PlayerComponent } from './game/player/player.component';
import { MarketComponent } from './game/market/market.component';
import { PyramidComponent } from './game/pyramid/pyramid.component';
import { TempleComponent } from './game/temple/temple.component';
import { ObeliskComponent } from './game/obelisk/obelisk.component';
import { BurialChamberComponent } from './game/burial-chamber/burial-chamber.component';
import { ShipComponent } from './game/ship/ship.component';
import { SiteHarbourComponent } from './game/site-harbour/site-harbour.component';
import { DepartingHarbourComponent } from './game/departing-harbour/departing-harbour.component';
import { InfoBoxComponent } from './game/info-box/info-box.component';
import { BottomLeftComponent } from './game/player/bottom-left/bottom-left.component';
import { BottomRightComponent } from './game/player/bottom-right/bottom-right.component';
import { TopLeftComponent } from './game/player/top-left/top-left.component';
import { TopRightComponent } from './game/player/top-right/top-right.component';

import { AlertModule, ModalModule } from 'ng2-bootstrap';
import { TooltipModule } from "ng2-tooltip";

import { DemoTempComponent } from './demo-temp/demo-temp.component';
import { DragDropComponent } from './demo-temp/drag-drop/drag-drop.component';
import { DragComponent } from './demo-temp/drag/drag.component';
import { DropComponent } from './demo-temp/drop/drop.component';
import { PlayingfieldComponent } from './demo-temp/playingfield/playingfield.component';
import { GameService } from "./shared/services/game.service";
import { LobbyDemoComponent } from './demo-temp/lobby-demo/lobby-demo.component';
import { DynamicChangesComponent } from './demo-temp/dynamic-changes/dynamic-changes.component';
import { PopoverBootstrapComponent } from './demo-temp/popover-bootstrap/popover-bootstrap.component';

import * as $ from 'jquery';
import { ModalsComponent } from './demo-temp/modals/modals.component';
import { MarketHarbourComponent} from './game/market-harbour/market-harbour.component';
import { ScrollbarComponent } from './demo-temp/scrollbar/scrollbar.component';
import { DragulaDemoComponent } from './demo-temp/dragula-demo/dragula-demo.component';

import { DragulaService, DragulaModule } from 'ng2-dragula/ng2-dragula';
import {ShipService} from "./shared/services/ship.service";
import { StoneComponent } from './game/stone/stone.component';
import {WSService} from "./shared/services/websocket.service";


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    GameComponent,
    HomeComponent,
    LobbyComponent,
    PlayerComponent,
    MarketComponent,
    PyramidComponent,
    TempleComponent,
    ObeliskComponent,
    BurialChamberComponent,
    ShipComponent,
    SiteHarbourComponent,
    DepartingHarbourComponent,
    InfoBoxComponent,
    BottomLeftComponent,
    BottomRightComponent,
    TopLeftComponent,
    TopRightComponent,
    DemoTempComponent,
    DragDropComponent,
    DragComponent,
    DropComponent,
    PlayingfieldComponent,
    LobbyDemoComponent,
    DynamicChangesComponent,
    PopoverBootstrapComponent,
    ModalsComponent,
    MarketHarbourComponent,
    ScrollbarComponent,
    DragulaDemoComponent,
    StoneComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    JsonpModule,
    routing,
    AlertModule.forRoot(), ModalModule.forRoot(), TooltipModule,
    DragulaModule
  ],
  providers: [AuthenticationService,
    AuthGuardService,
    UserService,
    GameService,
    WSService,
    DragulaService,
    ShipService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
