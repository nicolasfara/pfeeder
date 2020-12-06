import {Injectable} from '@angular/core';

import {Observable} from 'rxjs';
import io from 'socket.io-client/dist/socket.io.js';

@Injectable({
  providedIn: 'root'
})

export class WebsocketService {
  private socket;
  private url = 'http://localhost:3001';
  private token = localStorage.getItem('access_token');

  constructor() {

  }

  setupSocketConnection() {
    this.socket = io(this.url, {
      transports: ['websocket']
    });
    this.socket.on('connection', () => {
      console.log("token socket: " + this.token);
      this.socket.emit('authentication', {
        token: this.token
      });
    });
  }

  getMessage() {
    const observable = new Observable(observer => {
      this.socket.on('notifications', data => {
        console.log("NOTIFICA" + data);
        observer.next(data);
      });

    });
    return observable;
  }
}
