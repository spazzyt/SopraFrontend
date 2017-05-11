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
import { GameService } from "./shared/services/game.service";
import {DndModule} from 'ng2-dnd';
import { DragulaService, DragulaModule } from 'ng2-dragula/ng2-dragula';
import {ShipService} from "./shared/services/ship.service";
import { StoneComponent } from './game/stone/stone.component';
import {WSService} from "./shared/services/websocket.service";
import {LobbyService} from "./shared/services/lobby.service";
import { FinalDestinationComponent } from './game/final-destination/final-destination.component';


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
    StoneComponent,
    FinalDestinationComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    JsonpModule,
    routing,
    AlertModule.forRoot(), ModalModule.forRoot(), TooltipModule,
    DragulaModule,
    DndModule.forRoot()
  ],
  providers: [AuthenticationService,
    AuthGuardService,
    UserService,
    GameService,
    WSService,
    DragulaService,
    ShipService,
    LobbyService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
