import {Component, OnInit} from '@angular/core';
import {Ration} from '../../../_models/Ration';
import {DataService} from '../../../_services/data/data.service';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-showration',
  templateUrl: './showration.component.html',
  styleUrls: ['./showration.component.scss']
})
export class ShowrationComponent implements OnInit {
  errorMessage: string;
  showEditRation = false;
  modalTitle = 'Ration Dashboard';
  rations: Ration[] = [];
  private currentRationName: string;
  updateRationForm: FormGroup;

  constructor(private dataService: DataService, public fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.getRation();
  }

  getRation() {
    this.dataService.getRation().subscribe((rations1: Ration[]) => {
        this.rations = rations1;
        this.rations.forEach( x => x.time = new Date(x.time));
      },
      (error => {
        console.error('error caught in component');
        throw error;
      }));
  }

  EditRation(rationform) {
    this.showEditRation = true;
    this.modalTitle = 'Update ration';
    this.currentRationName = rationform.name;
    this.updateRationForm = this.fb.group({
      name: rationform.name,
      hours: rationform.time.getHours(),
      minutes: rationform.time.getMinutes(),
      ration: rationform.ration
    });
  }

  updateRation(updateRationForm) {
    const updateRation = updateRationForm.value;
    const rationID: Ration[] = this.rations.filter(x => x.name === this.currentRationName);

    // @ts-ignore
    this.dataService.patchRation(buf2hex(rationID[0]._id.id.data), updateRation)
      .subscribe(() => {
          this.showEditRation = false;
        },
        (error => {
          console.error('error caught in component');
          this.errorMessage = error;
          throw error;
        })
      );
  }
}

function buf2hex(buffer) { // buffer is an ArrayBuffer
  return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}
