import {Component, OnInit} from '@angular/core';

declare var $: any;
import {DataService} from '../shared/service/data/data.service';
import {Pet} from '../shared/model/Pet';

import {Ration} from '../shared/model/Ration';
import {WebsocketService} from '../websocket.service';
import {NotificationService} from '../notification.service';
import {Notification} from '../shared/model/Notification';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  fodders = [];
  pets: Pet[];
  rations: Ration[];
  messageList: string[] = [];
  hours: string;

  constructor(private service: DataService, private websocket: WebsocketService, private notifyService: NotificationService) {
  }

  ngOnInit(): void {


    this.websocket.getMessage().subscribe( (data: Notification) => {
      console.log('----------ARRIVATO MESSAGGIO----------');
      console.log(data.notificationType);
      this.notifyService.showNotification(data.message, data);
    });
    this.getPet();
    this.getFodder();
    this.getRation();

    $(document).on('click', '.openRationModal', function() {


      const petName = $(this).closest('td').prevAll('.petName').text();
      const petRationGrams = $(this).closest('td').prevAll('.petRationGrams').text().replace(' g', '');
      const rationTime = $(this).closest('td').prevAll('.rationTime').text();
      const hourTime = rationTime.substr(0, 2);
      let minuteTime: string;
      if (rationTime.includes('PM')) {
        minuteTime = rationTime.substr(3, 5).replace(' PM', '');
      } else {
        minuteTime = rationTime.substr(3, 5).replace(' AM', '');
      }

      const ration: number = +petRationGrams;
      const hourRation: number = +hourTime;
      const minuteRation: number = +minuteTime;
      $('.modal-body #petName').val(petName);
      $('.modal-body #ration').val('');
      $('.modal-body #hours').val('');
      $('.modal-body #minutes').val('');
      if (ration > 0) {
        $('.modal-body #ration').val(ration);
      }
      if (hourRation > 0) {
        $('.modal-body #hours').val(hourRation);
      }
      if (minuteRation > 0) {
        $('.modal-body #minutes').val(minuteRation);
      }
      $('body').append('#AddRation');
      $('#AddRation').modal('show');
    });

  }

  getPet(): void {
    this.service.getPets().then(pets => this.pets = pets);

  }

  getFodder(): void {
    this.service.getFodder().then(fodders => this.fodders = fodders);
  }

  getRation(): void {
    this.service.getRation().subscribe((data: Ration[]) => {
      //  if (Array.isArray(data) && data.length) {
      this.rations = data;
      /* NOT WORKING BECAUSE EVERY GET RETURN 1 RATION */
      // this.rations.insert(this.pets.indexOf(value),data)
      console.log(this.rations);
      //  }
    });
  }


  doesExist(time: Date): boolean {
    // tslint:disable-next-line:triple-equals
    return time.toDateString() != '';
  }

}


function buf2hex(buffer) { // buffer is an ArrayBuffer
  return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}

/*Array.prototype.insert = function ( index, item ) {
  this.splice( index, 0, item );
};*/
