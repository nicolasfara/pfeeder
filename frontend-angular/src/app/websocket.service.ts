import {Injectable} from '@angular/core';

import {Observable} from 'rxjs';
import io from 'socket.io-client/dist/socket.io.js';
@Injectable({
  providedIn: 'root'
})

export class WebsocketService {
  private socket;
  private url = 'http://localhost:3000';
  private token = localStorage.getItem('access_token');
  constructor() {

  }
  setupSocketConnection() {
    this.socket = io(this.url);
    this.socket.emit('my message', 'Hello there from Angular.');
  }
}
