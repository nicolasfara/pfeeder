import { Component, OnInit } from '@angular/core';
import {first} from "rxjs/operators";
import {AuthService} from "../shared/service/auth/auth.service";
import {Router} from "@angular/router";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Pet} from "../shared/model/Pet";
import {Fodder} from "../shared/model/Fodder";
import {DataService} from "../shared/service/data/data.service";
declare var $ : any
@Component({
  selector: 'app-addration',
  templateUrl: './addration.component.html',
  styleUrls: ['./addration.component.scss']
})
export class AddrationComponent implements OnInit {

  pets : Pet[] = [];
  fodders : Fodder[] = [];
  private petSelect: Pet;
  public addRationForm: FormGroup;
  constructor(
    public fb: FormBuilder,
    public authService: AuthService,
    public router: Router,
    private dataService: DataService
  ) {
    this.addRationForm = this.fb.group({
      ration: [''],
      minutes: [''],
      hours: [''],
      petId: [''] // L'utente selezionerà i nomi dei pet disponibili
      /* Poi si fa una query prima e si seleziona l'fodderSelect dei pet e dei fodder inserito*/

    });
  }
  ngOnInit(): void {
     this.getPets();
     this.getFodders();
  }

  getPets() {
    this.dataService.getPets().then(pets => this.pets = pets);
  }
  getFodders(){
    this.dataService.getFodder().then(fodders => this.fodders = fodders);
  }
  addRation(){
    this.petSelect =  this.pets.find(x => x.name == this.addRationForm.get('petName').value)
   // this.authService.addRation(this.addRationForm.value)
  }
}
