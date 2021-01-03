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
  private readonly socket: any;

  constructor() {
    this.socket = io(this.url, {
      transports: ['websocket']
    });
    this.socket.emit('authentication', {
      token: this.token
    });
  }


  getMessage() {
    return new Observable(observer => {
      this.socket.on('notifications', data => {
        observer.next(data);
      });
    });
  }
  disconnect(){
    if (this.socket){
      this.socket.close();
    }
  }

}
