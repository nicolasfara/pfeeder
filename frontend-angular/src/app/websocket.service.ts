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
  /* SOCKET ON AUTH SERVICE*/
  //
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
  // connect(){
  //   this.socket = io(this.url, { query: `auth_token=${(this.token)}`});
  //   console.log("connect!");
  // }
  constructor() {
    this.socket = io(this.url);
  }
  getMessages() {
    const observable = new Observable(observer => {
      this.socket.on('notifications', (data) => {
        observer.next(data);
      });
      // return () => {
      //   this.socket.disconnect();
      //  };
    });
    return observable;
  }
}
