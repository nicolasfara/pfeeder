import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {first} from 'rxjs/operators';
import {DataService} from '../../../_services/data/data.service';
import {Fodder} from '../../../_models/Fodder';
import {Pet} from '../../../_models/Pet';

declare var $: any;

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
  selectPet = 'Select Pet';
  errorMessage: string;
  submitted = false;

  petType = [
    'cat',
    'dog',
    'other'
  ];

  constructor(
    public fb: FormBuilder,
    public authService: DataService,
    public router: Router,
    private service: DataService
  ) {
    this.addPetForm = this.fb.group({
      name: ['', Validators.required],
      age: ['', Validators.required, Validators.minLength(1), Validators.pattern('^[0-9]*$')],
      weight: ['', Validators.required, Validators.minLength(1), Validators.pattern('^[0-9]*$')],
      idealWeight: ['', Validators.required, Validators.minLength(1), Validators.pattern('^[0-9]*$')],
      petType: ['', Validators.required],
      breed: ['', Validators.required],
      currentFodder: ['', Validators.required]

    });
  }

  get f() {
    return this.addPetForm.controls;
  }

  ngOnInit(): void {
    this.getFodder();
    // this.getPet();
    this.service.refreshNeeded.subscribe(() => {
      this.getFodder();
    });
  }

  addPet() {
    this.submitted = true;
    this.errorMessage = '';
    if (this.addPetForm.invalid) {
      return;
    }

    if (this.addPetForm.get('currentFodder').value === 'Select Fodder' || this.addPetForm.get('petType').value === ' ') {
      console.error('error caught in component');
      this.errorMessage = 'Wrong selection';
    } else {
      const fodderID: Fodder[] = this.fodders.filter(x => x.name === this.addPetForm.get('currentFodder').value);
      this.addPetForm.patchValue({
        // @ts-ignore
        currentFodder: this.service.buf2hex(fodderID[0]._id.id.data)
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

  }


  // savePet() {
  //   this.addPetForm.removeControl('currentFodder');
  //   const selectedPet = this.pets.find(x => x.name === this.addPetForm.get('name').value);
  //   console.log(this.addPetForm.value);
  //   // @ts-ignore
  //   this.authService.patchPet(this.addPetForm.value, selectedPet.id.id.data).pipe(first())
  //     .subscribe(
  //       () => {
  //         $('#AddPet').modal('hide');
  //       });
  // }

  getFodder(): void {
    this.service.getFodder().then(fodders => this.fodders = fodders);
  }

  // getPet(): void {
  //   this.service.getPets()
  //     .subscribe(
  //       pets => {
  //         this.pets = pets;
  //       },
  //       error => {
  //         alert(error);
  //       }
  //     );
  // }
}

$(window).on('pop', () => {
  $('#AddPet').modal('hide');
});
