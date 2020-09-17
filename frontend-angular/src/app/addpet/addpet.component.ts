import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {AuthService} from "../shared/service/auth/auth.service";
import {Router} from "@angular/router";
import {first} from "rxjs/operators";
import {DataService} from "../shared/service/data/data.service";
import {Fodder} from "../shared/model/Fodder";
declare var $ : any
@Component({
  selector: 'app-addpet',
  templateUrl: './addpet.component.html',
  styleUrls: ['./addpet.component.scss']
})

export class AddpetComponent implements OnInit {

  fodders : Fodder [];
  addPetForm: FormGroup;
  selectFodder = Fodder
  id: Fodder;
  constructor(
    public fb: FormBuilder,
    public authService: AuthService,
    public router: Router,
    private service : DataService
  ) {
    this.addPetForm = this.fb.group({
      name: [''],
      age: [''] ,
      weight: [''],
      idealWeight : [''],
      petType: [''],
      breed: [''],
      currentFodder: [''],

    });
  }
  ngOnInit(): void {
    this.getFodder();
  }

  addPet() {

    this.id =  this.fodders.find(x => x.name == this.addPetForm.get('currentFodder').value)
    console.log("Fodder: "+ this.id._id['id']['data'])

    this.addPetForm.patchValue({
      currentFodder : buf2hex(this.id._id['id']['data'])
    })
    console.log(this.addPetForm.value)
    this.authService.addPet(this.addPetForm.value) .pipe(first())
      .subscribe(
        data => {

          $('#addPetButton').click(function() {
            $('#addPet').modal('hide');
          });
        });
  }
  getFodder() :void {
    this.service.getFodder().then(fodders => this.fodders = fodders);
  }

}
function buf2hex(buffer) { // buffer is an ArrayBuffer
  return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}
