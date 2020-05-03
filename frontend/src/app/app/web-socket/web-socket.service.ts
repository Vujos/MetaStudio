import { Injectable } from '@angular/core';
import * as Stomp from "stompjs";

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  private url = "ws://localhost:8080/ws";

  constructor() {}

  getClient(){
    let client = Stomp.client(this.url)
    //client.debug = false;
    return client;
  }
}
