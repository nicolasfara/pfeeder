import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import io from 'socket.io-client/dist/socket.io.js';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class WebsocketService {
  private url = 'http://' + environment.apiBaseUrl + ':3001';
  private token = localStorage.getItem('access_token');
  private socket: any;

  constructor() {
    this.socket = io(this.url, {
      transports: ['websocket']
    });
  }

  setupSocketConnection() {
    this.socket.on('connection', () => {
      this.socket.emit('authentication', {
        token: this.token
      });
    });
  }

  getMessage() {
    return new Observable(observer => {
      this.socket.on('notifications', data => {
        observer.next();
      });
    });
  }
}
