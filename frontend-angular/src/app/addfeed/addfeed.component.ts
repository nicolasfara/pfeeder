import { Component, OnInit } from '@angular/core';
import {first} from "rxjs/operators";
import {FormBuilder, FormGroup} from "@angular/forms";
import {AuthService} from "../shared/service/auth/auth.service";
import {Router} from "@angular/router";
import {DataService} from "../shared/service/data/data.service";
import {Fodder} from "../shared/model/Fodder";
import {Pet} from "../shared/model/Pet";
declare var $ : any
@Component({
  selector: 'app-addfeed',
  templateUrl: './addfeed.component.html',
  styleUrls: ['./addfeed.component.scss']
})
export class AddfeedComponent implements OnInit {
  public addFeedForm: FormGroup;
  private fodders: Fodder[];
  private pets : Pet[];
  private fodderSelect: Fodder;
  private petSelect: Pet;

  constructor(public fb: FormBuilder,
              public authService: AuthService,
              public router: Router,
              private dataService: DataService) {

    this.addFeedForm = this.fb.group({
      ration: [''],
      kcal: [''],
      fodderId: [''], //L'utente selezionerà il nomi dei fodder disponnibili
      petId: [''] // L'utente selezionerà i nomi dei pet disponibili
      /* Poi si fa una query prima e si seleziona l'fodderSelect dei pet e dei fodder inserito*/

    });
  }

  ngOnInit(): void {
    this.getFodder()
    this.getPet()
  }
  addFeed() {
    this.fodderSelect =  this.fodders.find(x => x.name == this.addFeedForm.get('fodderId').value)
    this.petSelect =  this.pets.find(x => x.name == this.addFeedForm.get('petId').value)
    console.log("Fodder fodderSelect:" +buf2hex(this.fodderSelect._id['id']['data']))
    console.log("Per  fodderSelect:" +buf2hex(this.petSelect._id['id']['data']))
    this.addFeedForm.patchValue({
      fodderId : buf2hex(this.fodderSelect._id['id']['data']),
      petId : buf2hex(this.petSelect._id['id']['data'])
    })
    this.authService.addFeed(this.addFeedForm.value) .pipe(first())
      .subscribe(
        data => {
          $('#addFeedButton').click(function() {
            $('#addFeed').modal('hide');
          });
        });
  }
  getFodder() :void {
    this.dataService.getFodder().then(fodders => this.fodders = fodders);
  }

  getPet(): void {
    this.dataService.getPets().then(pets => this.pets = pets);
  }
}
function buf2hex(buffer) { // buffer is an ArrayBuffer
  return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}
