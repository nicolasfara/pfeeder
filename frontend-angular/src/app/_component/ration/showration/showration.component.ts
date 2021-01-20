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
  deletePopUp = false;
  private currentRation: Ration;

  constructor(private dataService: DataService, public fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.dataService.refreshNeeded.subscribe(() => {
      this.getRation();
    });
    this.getRation();
  }

  getRation() {
    this.dataService.getRation().subscribe((rations1: Ration[]) => {
        this.rations = rations1;
        this.rations.forEach( x=> x.time = x.time.)
      },
      (error => {
        console.error('error caught in component');
        throw error;
      }));
  }

  editRation(rationForm: Ration) {
    this.showEditRation = true;
    this.modalTitle = 'Update ration';
    this.currentRationName = rationForm.name;
    this.updateRationForm = this.fb.group({
      name: rationForm.name,
      hours: new Date(rationForm.time).getHours(),
      minutes: new Date(rationForm.time).getMinutes(),
      ration: rationForm.ration
    });
  }

  updateRation(updateRationForm) {
    const updateRation = updateRationForm.value;
    const rationID: Ration[] = this.rations.filter(x => x.name === this.currentRationName);

    // @ts-ignore
    this.dataService.patchRation(rationID[0]._id.id.data, updateRation)
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

  deleteRationPopUp(ration: Ration) {
    this.deletePopUp = true;
    this.currentRation = ration;
  }

  deleteRation() {

    // @ts-ignore
    this.dataService.deleteRation(this.currentRation._id.id.data)
      .subscribe(() => {
          this.deletePopUp = false;
          this.currentRation = null;
        },
        (error => {
          console.error('error caught in component');
          this.errorMessage = error;
          throw error;
        })
      );
  }

  cancelOperation() {
    this.deletePopUp = false;
    this.currentRation = null;
  }

  back() {
    this.showEditRation = false;
  }
}
