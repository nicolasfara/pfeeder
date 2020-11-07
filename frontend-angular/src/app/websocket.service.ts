import { Injectable } from '@angular/core';
const token = sessionStorage.getItem('access_token');
import {Observable} from "rxjs";
import {io} from "socket.io-client";
@Injectable({
  providedIn: 'root'
})

export class WebsocketService {

  socket: any;
  url = 'http://localhost:3000'
  constructor() {
    /* THIS GENERATE CONTNUE POST IN POLLING! */
    //  this.socket = io(this.url, {
    //   query: `auth_token=${token}`
    // });
  }
  listen(){
    return new Observable((sub) =>{
      //
      // this.socket.on('notifications',(data) =>{
      //   console.log("New message:" + data)
      //   sub.next(data);
      // })
    })
  }
}
