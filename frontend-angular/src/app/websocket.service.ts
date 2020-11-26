import {Injectable} from '@angular/core';
import {io} from 'socket.io-client/build/index';
import {Observable} from 'rxjs';
@Injectable({
  providedIn: 'root'
})

export class WebsocketService {

  /* SOCKET ON AUTH SERVICE*/
  //
  // token = localStorage.getItem('access_token');
  // private url = 'http://localhost:3000';
  // private socket;
  //
  // constructor() {
  //     //this.socket = io(this.url, { query: `auth_token=${(this.token)}`});
  // }
  // create(token: string){
  //   console.log("Create connection ");
  //   this.socket = io(this.url, { query: `auth_token=${(token)}`});
  //
  // }
  // listen() {
  //   return new Observable((sub) => {
  //     this.socket.on('notifications', (data) => {
  //       sub.next(data);
  //     });
  //   });
  // }
  //
  // close() {
  //   if (this.socket) {
  //     this.socket.removeAllListeners();
  //     this.socket.disconnect();
  //     this.socket = undefined;
  //   }
  // }
}
