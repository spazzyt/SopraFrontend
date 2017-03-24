import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {HttpModule, JsonpModule} from '@angular/http';

import { AppComponent } from './app.component';
import {AuthGuardService} from "./shared/services/auth-guard.service";
import {UserService} from "./shared/services/user.service";
import {routing} from "./app.routing";
import {AuthenticationService} from "./shared/services/authentication.service";
import {LoginComponent} from "./login/login.component";
import {GameComponent} from "./game/game.component";
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
import { CardsComponent } from './game/player/cards/cards.component';
import { TopLeftLeftComponent } from './game/player/cards/top-left-left/top-left-left.component';
import { TopMiddleLeftComponent } from './game/player/cards/top-middle-left/top-middle-left.component';
import { TopMiddleRightComponent } from './game/player/cards/top-middle-right/top-middle-right.component';
import { TopRightRightComponent } from './game/player/cards/top-right-right/top-right-right.component';
import { BottomLeftLeftComponent } from './game/player/cards/bottom-left-left/bottom-left-left.component';
import { BottomMiddleLeftComponent } from './game/player/cards/bottom-middle-left/bottom-middle-left.component';
import { BottomMiddleRightComponent } from './game/player/cards/bottom-middle-right/bottom-middle-right.component';
import { BottomRightRightComponent } from './game/player/cards/bottom-right-right/bottom-right-right.component';
import { PurpleCardComponent } from './game/player/cards/purple-card/purple-card.component';

import {AlertModule, ModalModule} from 'ng2-bootstrap';
import {TooltipModule} from "ng2-tooltip";

import { DemoTempComponent } from './demo-temp/demo-temp.component';
import { DragDropComponent } from './demo-temp/drag-drop/drag-drop.component';
import { DragComponent } from './demo-temp/drag/drag.component';
import { DropComponent } from './demo-temp/drop/drop.component';
import { PlayingfieldComponent } from './demo-temp/playingfield/playingfield.component';

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
    CardsComponent,
    TopLeftLeftComponent,
    TopMiddleLeftComponent,
    TopMiddleRightComponent,
    TopRightRightComponent,
    BottomLeftLeftComponent,
    BottomMiddleLeftComponent,
    BottomMiddleRightComponent,
    BottomRightRightComponent,
    PurpleCardComponent,
    DemoTempComponent,
    DragDropComponent,
    DragComponent,
    DropComponent,
    PlayingfieldComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    JsonpModule,
    routing,
    AlertModule.forRoot(), ModalModule.forRoot(), TooltipModule
  ],
  providers: [AuthenticationService,AuthGuardService,UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
