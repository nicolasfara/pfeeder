import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Pet} from '../../../_models/Pet';
import {DataService} from '../../../_services/data/data.service';

declare var $: any;

@Component({
  selector: 'app-addration',
  templateUrl: './addration.component.html',
  styleUrls: ['./addration.component.scss']
})

export class AddrationComponent implements OnInit {

  pets: Pet[] = [];
  public addRationForm: FormGroup;
  submitted = false;
  errorMessage: string;

  constructor(
    public fb: FormBuilder,
    public router: Router,
    private dataService: DataService
  ) {
    this.addRationForm = this.fb.group({
      name: ['', [Validators.required]],
      ration: ['', [Validators.required, Validators.minLength(1), Validators.pattern('^[0-9]*$')]],
      minutes: ['', [Validators.required, Validators.minLength(1), Validators.pattern('^[0-9]*$')]],
      hours: ['', [Validators.required, Validators.minLength(1), Validators.pattern('^[0-9]*$')]],
      petId: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.getPets();
    this.dataService.refreshNeeded.subscribe(() => {
      this.getPets();
    });
  }

  get f() {
    return this.addRationForm.controls;
  }

  getPets() {
    this.dataService.getPets().subscribe((pet: Pet[]) => {
        this.pets = pet;
      },
      (error => {
        console.error('error caught in component');
        throw error;
      }));
  }

  addRation() {
    this.submitted = true;
    this.errorMessage = '';
    if (this.addRationForm.invalid) {
      return;
    }
    const petId: Pet[] = this.pets.filter(x => x.name === this.addRationForm.value.petId);
    // @ts-ignore
    this.dataService.addRation(this.addRationForm.value, petId[0]._id.id.data)
      .subscribe(() => {
          $('#AddRation').modal('hide');
        },
        (error => {
          console.error('error caught in component');
          this.errorMessage = error;
          throw error;
        }));
  }

  back() {

  }
}
