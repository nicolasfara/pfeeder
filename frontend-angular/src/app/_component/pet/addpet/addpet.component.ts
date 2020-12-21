import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {first} from 'rxjs/operators';
import {DataService} from '../../../_services/data/data.service';
import {Fodder} from '../../../_models/Fodder';
import {Pet} from '../../../_models/Pet';

declare var $: any;
// TODO VALIDATION
// TODO PATCH IN SAME TEMPLATE
@Component({
  selector: 'app-addpet',
  templateUrl: './addpet.component.html',
  styleUrls: ['./addpet.component.scss']
})

export class AddpetComponent implements OnInit {

  fodders: Fodder [];
  pets: Pet[];
  addPetForm: FormGroup;
  fodderID: Fodder;
  selectedOption = 'Select Fodder';
  errorMessage: string;

  constructor(
    public fb: FormBuilder,
    public authService: DataService,
    public router: Router,
    private service: DataService
  ) {
    this.addPetForm = this.fb.group({
      name: [''],
      age: [''],
      weight: [''],
      idealWeight: [''],
      petType: [''],
      breed: [''],
      currentFodder: [''],

    });
  }

  ngOnInit(): void {
    this.getFodder();
    this.getPet();
  }

  addPet() {
    const fodderID: Fodder[] = this.fodders.filter(x => x.name === this.addPetForm.get('currentFodder').value);
    this.addPetForm.patchValue({
      // @ts-ignore
      currentFodder: buf2hex(fodderID[0]._id.id.data)
    });
    console.log(this.addPetForm.value);
    this.authService.addPet(this.addPetForm.value).subscribe(() => {
        $('#AddPet').modal('hide');
      },
      (error => {
        console.error('error caught in component');
        this.errorMessage = error;
        throw error;
      }));
  }


  savePet() {
    this.addPetForm.removeControl('currentFodder');
    // this.addPetForm.patchValue({
    //   currentFodder : buf2hex(this.id._id['id']['data'])
    // })
    const selectedPet = this.pets.find(x => x.name === this.addPetForm.get('name').value);
    console.log(this.addPetForm.value);
    // @ts-ignore
    this.authService.patchPet(this.addPetForm.value, buf2hex(selectedPet.id.id.data)).pipe(first())
      .subscribe(
        data => {
          $('#AddPet').modal('hide');
        });
  }

  getFodder(): void {
    this.service.getFodder().then(fodders => this.fodders = fodders);
  }

  openAddFodder() {
    $(' #AddFodder').modal('show');
  }

  getPet(): void {
    this.service.getPets()
      .subscribe(
        pets => {
          this.pets = pets;
          // this.addPetForm.reset({ name: '', description: '', price: 0, quantityOnHand: 0 });
        },
        error => {
          alert(error);
        }
      );
  }

}

function buf2hex(buffer) { // buffer is an ArrayBuffer
  return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}
