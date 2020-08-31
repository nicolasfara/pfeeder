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
      petType: [''],
      breed: [''],
      currentFodder: ['']
    });
  }
  ngOnInit(): void {
    this.getFodder();
  }

  addPet() {

    console.log(  this.fodders.find(x => x.name == this.addPetForm.get('currentFodder').value));
    var id =  this.fodders.filter(function (el){
      return el.name == this.addPetForm.get('currentFodder').value
    })
    console.log(id)
    /* this.addPetForm.patchValue({
      currentFodder : this.selectFodder['id']
    })*/
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
