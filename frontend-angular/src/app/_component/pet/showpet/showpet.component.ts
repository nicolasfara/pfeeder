import {Component, OnInit} from '@angular/core';
import {Pet} from '../../../_models/Pet';
import {DataService} from '../../../_services/data/data.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Fodder} from '../../../_models/Fodder';


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
  selectedOption = 'Select Fodder';
  selectPet = 'Select Pet';

  petType = [
    'cat',
    'dog',
    'other'
  ];
  deletePopUp = false;
  private currentPet: Pet;

  constructor(private service: DataService, public fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.getPet();
    this.getFodder();
    this.service.refreshNeeded.subscribe(() => {
      this.getPet();
      this.getFodder();
    });
  }

  EditPet(petForm) {
    this.showEditPet = true;
    this.modalTitle = 'Update pet';
    this.currentPetName = petForm.name;

    this.editPetForm = this.fb.group({
      name: petForm.name,
      age: petForm.age,
      weight: petForm.weight,
      petType: petForm.petType,
      breed: petForm.breed,
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

  updatePet(updatePetForm) {
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
    this.service.patchPet(pet, petID[0]._id.id.data)
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

  deletePetPopUp(pet: Pet) {
    this.deletePopUp = true;
    this.currentPet = pet;
  }

  cancelOperation() {
    this.deletePopUp = false;
    this.currentPet = null;
  }

  deletePet() {

    // @ts-ignore
    this.service.deletePet(this.currentPet._id.id.data)
      .subscribe(() => {
          this.deletePopUp = false;
          this.currentPet = null;
        },
        (error => {
          console.error('error caught in component');
          this.errorMessage = error;
          throw error;
        })
      );
  }

  back() {
    this.showEditPet = false;
  }
}

