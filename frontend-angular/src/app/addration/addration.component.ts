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
   petSelect: Pet;
  public addRationForm: FormGroup;
  constructor(
    public fb: FormBuilder,
    public authService: AuthService,
    public router: Router,
    private dataService: DataService
  ) {
    this.addRationForm = this.fb.group({
      name:[''],
      ration: [''],
      minutes: [''],
      hours: [''],
     // petId: [''] // L'utente selezionerà i nomi dei pet disponibili
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
  addRation() {
    this.dataService.sendGetPets().subscribe((data: Pet[]) => {
      this.pets = data;
      var petName = $('#petName').val()
      this.petSelect = this.pets.find(x => x.name == petName)
      console.log(petName)
      this.authService.addRation(this.addRationForm.value, buf2hex(this.petSelect._id['id']['data'])).pipe(first())
        .subscribe(
          data => {

            $('#AddRation').modal('hide');
          });
    })
  }

}
function buf2hex(buffer) { // buffer is an ArrayBuffer
  return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}
