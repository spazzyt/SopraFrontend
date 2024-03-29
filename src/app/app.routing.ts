﻿import { Routes, RouterModule } from '@angular/router';

import {AuthGuardService} from "./shared/services/auth-guard.service";
import {LoginComponent} from "./login/login.component";
import {GameComponent} from "./game/game.component";
import {HomeComponent} from "./home/home.component";
import {LobbyComponent} from "./lobby/lobby.component";

const appRoutes: Routes = [
    { path: 'lobby', component: LobbyComponent },
    { path: 'login', component: LoginComponent },
    { path: 'game', component: GameComponent },
    { path: 'game/:id', component: GameComponent },
    //{ path: 'game', component: GameComponent, canActivate: [AuthGuardService] },
    { path: 'home', component: HomeComponent },

    { path: '', redirectTo: '/home', pathMatch: 'full' },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);
