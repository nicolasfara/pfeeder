import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {AuthService} from "../shared/auth.service";
import {Router} from "@angular/router";
import {first} from "rxjs/operators";
declare var $ : any
@Component({
  selector: 'app-addpet',
  templateUrl: './addpet.component.html',
  styleUrls: ['./addpet.component.scss']
})

export class AddpetComponent implements OnInit {


  addPetForm: FormGroup;
  constructor(
    public fb: FormBuilder,
    public authService: AuthService,
    public router: Router
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
  }

  addPet() {
    this.authService.addPet(this.addPetForm.value) .pipe(first())
      .subscribe(
        data => {
          $('#addPet').click(function() {
            $('#ModalExample').modal('hide');
          });
        });
  }
}
