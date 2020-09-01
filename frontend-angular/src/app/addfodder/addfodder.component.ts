import {Component, OnInit} from '@angular/core';
import {first} from "rxjs/operators";
import {FormBuilder, FormGroup} from "@angular/forms";
import {AuthService} from "../shared/service/auth/auth.service";
import {Router} from "@angular/router";
import {DataService} from "../shared/service/data/data.service";
declare var $ : any
@Component({
  selector: 'app-addfodder',
  templateUrl: './addfodder.component.html',
  styleUrls: ['./addfodder.component.scss']
})
export class AddfodderComponent implements OnInit {
  public addFodderForm: FormGroup;

  constructor(public fb: FormBuilder,
              public authService: AuthService,
              public router: Router,
              private service: DataService) {
    this.addFodderForm = this.fb.group({
      name: [''],
      companyName: [''],
      price: [''],
      weight: [''],
      nutritionFacts : {}
     /* nutritionFacts: {
        kcal: [''],
        proteins: [''],
        fats: [''],
        vitamins: [''],
        carbohydrates: [''],
      }*/
    // TODO Resolve nested field in form group
    });
  }

  ngOnInit(): void {
  }

  addFodder() {
    this.authService.addFodder(this.addFodderForm.value) .pipe(first())
      .subscribe(
        data => {
          $('#addFodderButton').click(function() {
            $('#AddFodder').modal('hide');
          });
        });

  }
}
