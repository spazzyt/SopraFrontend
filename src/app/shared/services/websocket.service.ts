import { Injectable } from '@angular/core';
import {AuthenticationService} from "./authentication.service";

export class WSMessage {
  public type:string;
  public payload:string;
}

@Injectable()
export class WSService {

  private webSocket: WebSocket;

  constructor(private authenticationService: AuthenticationService) { }

  connectToGame(gameId) {

     this.webSocket = new WebSocket('ws://localhost:8080/websocket');

    this.webSocket.onmessage = function (event) {

       let msg = JSON.parse(event.data);
      console.log(event.data, msg);
    }
    this.webSocket.onopen = (event) => {
      console.log("Socket is open", event);

      // Tell server we joined the mage
      var msg = {
        gameId: gameId,
        user: this.authenticationService.mySelf.username
      };

      this.webSocket.send(JSON.stringify(msg));
    }

  }
}
