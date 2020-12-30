import { Component, OnInit } from '@angular/core';
import {Pet} from '../../../_models/Pet';
import {DataService} from '../../../_services/data/data.service';
import {Fodder} from '../../../_models/Fodder';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-switchfodder',
  templateUrl: './switchfodder.component.html',
  styleUrls: ['./switchfodder.component.scss']
})
export class SwitchfodderComponent implements OnInit {

  pets: Pet[] = [];
  fodders: Fodder[] = [];
  showEditPetFodder = false;
  errorMessage: string;
  selectedOption = 'Select Fodder';
  editFodderPetForm: FormGroup;
  currentFodderPet: any;
  currentPetName: string;
  modalTitle = 'Pet associate to fodder';

  constructor(private dataService: DataService, public fb: FormBuilder) { }

  ngOnInit(): void {
    this.getPet();
    this.getFodder();
    this.dataService.refreshNeeded.subscribe(() => {
      this.getPet();
      this.getFodder();
    });
  }
  getPet(): void {
    this.dataService.getPets().subscribe(
      (pet: Pet[]) => {
        this.pets = pet;
      },
      (error => {
        console.error('error caught in component');
        throw error;
      }));

  }

  editPetFodder(pet: Pet) {
    this.modalTitle = 'Update pet fodder association';
    this.showEditPetFodder = true;
    this.currentPetName = pet.name;
    this.editFodderPetForm = this.fb.group({
      name : pet.name,
      currentFodder: pet.currentFodder.name
    });
  }

  getFodder(): void {
    this.dataService.getFodder().then(fodders => this.fodders = fodders);
  }

  updatePetFodder(editFodderPetForm: FormGroup) {
    this.currentFodderPet = editFodderPetForm.value;
    const petID: Pet[] = this.pets.filter(x => x.name === this.currentPetName);
    const fodderID: Fodder[] = this.fodders.filter(x => x.name === this.currentFodderPet.currentFodder);

    const fodderUpdate = {
      // @ts-ignore
      fodderId: buf2hex(fodderID[0]._id.id.data)
    };
    // @ts-ignore
    this.dataService.patchFodderPet(buf2hex(petID[0]._id.id.data), fodderUpdate)
      .subscribe(() => {
          this.showEditPetFodder = false;
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
