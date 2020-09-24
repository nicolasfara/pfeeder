import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {AuthService} from "../shared/service/auth/auth.service";
import {Router} from "@angular/router";
import {DataService} from "../shared/service/data/data.service";
import {first} from "rxjs/operators";
declare var $: any
@Component({
  selector: 'app-updatefodder',
  templateUrl: './updatefodder.component.html',
  styleUrls: ['./updatefodder.component.scss']
})
export class UpdatefodderComponent implements OnInit {
  public updateFodderForm: FormGroup;

  constructor(public fb: FormBuilder,
              public authService: AuthService,
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
    this.authService.addFodder(this.updateFodderForm.value).pipe(first())
      .subscribe(
        data => {
          $('#UpdateFodder').modal('hide');
        });
  }
}
