import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {DataService} from '../../../_services/data/data.service';

declare var $: any;
// TODO ADD SUBJECT TO UPDATE

@Component({
  selector: 'app-addfodder',
  templateUrl: './addfodder.component.html',
  styleUrls: ['./addfodder.component.scss']
})
export class AddfodderComponent implements OnInit {
  addFodderForm: FormGroup;
  submitted = false;
  errorMessage;

  constructor(public fb: FormBuilder,
              public router: Router,
              private service: DataService) {
  }

  get f() {
    return this.addFodderForm.controls;
  }

  async addFodder() {
    this.submitted = true;
    this.errorMessage = '';
    if (this.addFodderForm.invalid) {
      return;
    }
    this.service.addFodder(this.addFodderForm.value).subscribe(() => {
        $('#AddFodder').modal('hide');
      },
      (error => {
        console.error('error caught in component');
        this.errorMessage = error;
        throw error;
      })
    );
  }

  ngOnInit(): void {
    this.addFodderForm = this.fb.group({
      name: ['', [Validators.required]],
      companyName: ['', [Validators.required]],
      price: ['', [Validators.required, Validators.minLength(1), Validators.pattern('^[0-9]*$')]],
      weight: ['', [Validators.required, Validators.minLength(1), Validators.pattern('^[0-9]*$')]],
      kcal: ['', [Validators.required, Validators.minLength(1), Validators.pattern('^[0-9]*$')]],
      proteins: ['', [Validators.required, Validators.minLength(1), Validators.pattern('^[0-9]*$')]],
      fats: ['', [Validators.required, Validators.minLength(1), Validators.pattern('^[0-9]*$')]],
      vitamins: ['', [Validators.required, Validators.minLength(1), Validators.pattern('^[0-9]*$')]],
      carbohydrates: ['', [Validators.required, Validators.minLength(1), Validators.pattern('^[0-9]*$')]]
    });
  }
}

