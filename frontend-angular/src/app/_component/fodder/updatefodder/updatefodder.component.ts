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
  fodders = [];
  @Input() message: string;
  private fodderID: any;

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
    this.getFodder();
    if ($('#UpdateFodder').hasClass('in')){
        console.log(this.currentFodder);
      }




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
  getFodder(): void {
    this.service.getFodder().then(fodders => this.fodders = fodders);
  }
  updateFodder() {
    console.log(this.result.name);
    this.fodderID = this.fodders.filter(x => x.name === this.result.name);
    console.log(this.fodders);
    console.log(this.fodderID)
    // @ts-ignore
    const destr = this.fodderID._id.id;
    console.log(this.fodderID);



    this.service.patchFodder(buf2hex(destr.data), this.updateFodderForm.value).pipe(first())
      .subscribe(
        data => {
          $('#UpdateFodder').modal('hide');
        });
  }


}
function buf2hex(buffer) { // buffer is an ArrayBuffer
  return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}
