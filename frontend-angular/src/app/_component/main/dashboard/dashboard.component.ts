import {Component, OnInit} from '@angular/core';

import {DataService} from '../../../_services/data/data.service';
import {Pet} from '../../../_models/Pet';
import {Ration} from '../../../_models/Ration';
import {WebsocketService} from '../../../_services/notification/websocket.service';
import {NotificationService} from '../../../_services/notification/notification.service';
import {Notification} from '../../../_models/Notification';
import {AuthService} from '../../../_services/auth/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  pets: Pet[] = [];
  rations: Ration[] = [];

  constructor(private service: DataService, private websocket: WebsocketService, private notifyService: NotificationService,
              private authService: AuthService) {
  }


  ngOnInit(): void {
    this.websocket.getMessage().subscribe((data: Notification) => {
      this.notifyService.showNotification(data.message, data.notificationType);
    });

    this.authService.closeConnection.subscribe(() => {
      this.websocket.disconnect();
    });
    this.service.refreshNeeded.subscribe(() => {
      this.getPet();
      this.getRation();
    });
    this.getPet();
    this.getRation();
  }

  getPet(): void {
    this.service.getPets().subscribe(
      (pet: Pet[]) => {
        this.pets = pet;
      },
      (error => {
        console.error('error caught in component');
        throw error;
      }));
  }

  getRation(): void {
    this.service.getRation().subscribe((data: Ration[]) => {
      this.rations = data;
    });

  }

  doesExist(time: Date): boolean {
    return time.toDateString() !== '';
  }
}


function buf2hex(buffer) { // buffer is an ArrayBuffer
  return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}
