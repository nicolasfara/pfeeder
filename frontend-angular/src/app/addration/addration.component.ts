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
  addFeedForm: FormGroup;
  constructor(
    public fb: FormBuilder,
    public authService: AuthService,
    public router: Router,
    private dataService: DataService
  ) {

    this.addFeedForm = this.fb.group({
      quantity: [''],
      kcal: [''],
      fodderId: [''], //L'utente selezionerà il nomi dei fodder disponnibili
      petId: [''] // L'utente selezionerà i nomi dei pet disponibili
      /* Poi si fa una query prima e si seleziona l'id dei pet e dei fodder inserito*/

    });
  }

  ngOnInit(): void {
    this.dataService.sendGetPets().subscribe((data: Pet[])=>{
      this.pets = data;
    })
    this.dataService.sendGetFodder().subscribe((data: Fodder[])=>{
      this.fodders = data
    })
  }
  addFeed() {
    this.authService.addFeed(this.addFeedForm.value) .pipe(first())
      .subscribe(
        data => {
          $('#addFeedButton').click(function() {
            $('#addFeed').modal('hide');
          });
        });
  }
}
