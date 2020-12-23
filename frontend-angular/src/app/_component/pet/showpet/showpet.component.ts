import {Component, OnInit} from '@angular/core';
import {Pet} from '../../../_models/Pet';
import {DataService} from '../../../_services/data/data.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Fodder} from '../../../_models/Fodder';

declare var $: any;

@Component({
  selector: 'app-showpet',
  templateUrl: './showpet.component.html',
  styleUrls: ['./showpet.component.scss']
})
export class ShowpetComponent implements OnInit {
  pets: Pet[];
  modalTitle = 'Show Pet';
  showEditPet = false;
  public editPetForm: FormGroup;
  private currentPetName: string;
   errorMessage: string;
   fodders: Fodder[] = [];
  private currentFodderName: string;
  selectedOption = 'Select Fodder';
  selectPet = 'Select Pet';

  petType = [
    'cat',
    'dog',
    'other'
  ];
  constructor(private service: DataService, public fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.getPet();
    this.getFodder();
    this.service.refreshNeeded.subscribe(() => {
      this.getPet();
    });
  }
  EditPet(petform) {
    this.showEditPet = true;
    this.modalTitle = 'Update pet';
    this.currentPetName = petform.name;
    console.log(petform.petType);
    this.editPetForm = this.fb.group({
      name: petform.name,
      age: petform.age,
      weight: petform.weight,
      petType: petform.petType,
      breed: petform.breed,
    });
  }
  getPet(): void {
    this.service.getPets().subscribe((pet: Pet[]) => {
        this.pets = pet;
      },
      (error => {
        console.error('error caught in component');
        throw error;
      }));

  }
  getFodder(): void {
    this.service.getFodder().then(fodders => this.fodders = fodders);
  }
  updatePet(updatePetForm ) {
    const updatePet = updatePetForm.value;
    const petID: Pet[] = this.pets.filter(x => x.name === this.currentPetName);
    console.log(updatePet);
    const pet = {
      name: updatePet.name,
      weight: updatePet.weight,
      age: updatePet.age,
      petType: updatePet.petType,
      breed: updatePet.breed
    };
    // @ts-ignore
    this.service.patchPet(pet, buf2hex(petID[0]._id.id.data))
      .subscribe(() => {
          this.showEditPet = false;
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
