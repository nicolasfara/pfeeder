import {Component, OnInit} from '@angular/core';
import { AuthService } from './_services/auth/auth.service';
import {WebsocketService} from "./_services/notification/websocket.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'frontend-angular';
  constructor(public authService: AuthService, private socketService: WebsocketService) { }
  ngOnInit() {
    //this.socketService.setupSocketConnection();
  }
  logout() {
    this.authService.doLogout();
  }
}
