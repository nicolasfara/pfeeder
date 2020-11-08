import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Socket} from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})

export class WebsocketService {

  constructor(private socket: Socket) {
  }

  listen() {
    return new Observable((sub) => {
      this.socket.on('notifications', (data) => {
        sub.next(data);
      });
    });
  }
}
