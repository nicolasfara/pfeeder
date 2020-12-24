import {Component, OnInit} from '@angular/core';

import {DataService} from '../../../_services/data/data.service';
import {Pet} from '../../../_models/Pet';
import {Ration} from '../../../_models/Ration';
import {WebsocketService} from '../../../_services/notification/websocket.service';
import {NotificationService} from '../../../_services/notification/notification.service';
import {Notification} from '../../../_models/Notification';

//TODO SISTEMARE NOME CURRENT FODDER
// TODO SISTEMARE NOME PET NELLE RAZIONI IN BASE A RAZIONE NON AGGIUNTA DI PETNAME IN VETTORE


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  fodders = [];
  pets: Pet[] = [];
  petName = [];
  rations: Ration[] = [];
  messageList: string[] = [];
  hours: string;

  constructor(private service: DataService, private websocket: WebsocketService, private notifyService: NotificationService) {
  }


  ngOnInit(): void {
    this.websocket.getMessage().subscribe((data: Notification) => {
      this.notifyService.showNotification(data.message, data.notificationType);
    });

    this.service.refreshNeeded.subscribe(() => {
      this.getPet();
      this.getRation();
    });
    this.getPet();
    this.getFodder();
    this.getRation();
  }

  getPet(): void {
    this.service.getPets().subscribe(
      (pet: Pet[]) => {
        this.pets = pet;
        this.pets.forEach(x => this.petName.push(x.name));
      },
      (error => {
        console.error('error caught in component');
        throw error;
      }));
  }

  getFodder(): void {
    this.service.getFodder().then(fodders => this.fodders = fodders);
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

