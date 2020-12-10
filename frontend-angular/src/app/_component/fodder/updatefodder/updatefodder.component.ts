import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {AuthService} from "../../../_services/auth/auth.service";
import {Router} from "@angular/router";
import {DataService} from "../../../_services/data/data.service";
import {first} from "rxjs/operators";
import {Pet} from "../../../_models/Pet";
declare var $: any
@Component({
  selector: 'app-updatefodder',
  templateUrl: './updatefodder.component.html',
  styleUrls: ['./updatefodder.component.scss']
})
export class UpdatefodderComponent implements OnInit {
  public updateFodderForm: FormGroup;

  constructor(public fb: FormBuilder,
              public router: Router,
              private service: DataService) {
    this.updateFodderForm = this.fb.group({
      name: [''],
      companyName: [''],
      price: [''],
      weight: [''],
      kcal: [''],
      proteins: [''],
      fats: [''],
      vitamins: [''],
      carbohydrates: ['']
    });
  }

  ngOnInit(): void {
  }

  updateFodder() {
    this.service.addFodder(this.updateFodderForm.value).pipe(first())
      .subscribe(
        data => {
          $('#UpdateFodder').modal('hide');
        });
  }


}
