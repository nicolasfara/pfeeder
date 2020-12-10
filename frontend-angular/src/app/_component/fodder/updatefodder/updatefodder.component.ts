import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {DataService} from '../../../_services/data/data.service';
import {first} from 'rxjs/operators';

declare var $: any;
@Component({
  selector: 'app-updatefodder',
  templateUrl: './updatefodder.component.html',
  styleUrls: ['./updatefodder.component.scss']
})
export class UpdatefodderComponent implements OnInit {
  public updateFodderForm: FormGroup;
  currentFodder  = localStorage.getItem('currentFodder') ;

   result = JSON.parse(this.currentFodder);
  @Input() message: string;

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

  get f() {
    return this.result;
  }
  ngOnInit(): void {
    // const currentFodder  = localStorage.getItem('currentFodder') ;
    //
    // const result = JSON.parse(currentFodder);
    // console.log(result.name);
    // this.updateFodderForm.setValue({
    //   name: result.name,
    //   companyName: result.companyName,
    //   price: result.price,
    //   weight: result.weight,
    //   kcal: result.kcal,
    //   proteins: result.proteins,
    //   fats: result.fats,
    //   vitamins: result.vitamins,
    //   carbohydrates: result.carbohydrates
    // });



  }

  updateFodder() {
    this.service.addFodder(this.updateFodderForm.value).pipe(first())
      .subscribe(
        data => {
          $('#UpdateFodder').modal('hide');
        });
  }


}
