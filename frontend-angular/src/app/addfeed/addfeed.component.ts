import { Component, OnInit } from '@angular/core';
import {first} from "rxjs/operators";
import {AuthService} from "../shared/auth.service";
import {Router} from "@angular/router";
import {FormBuilder, FormGroup} from "@angular/forms";
declare var $ : any
@Component({
  selector: 'app-addfeed',
  templateUrl: './addfeed.component.html',
  styleUrls: ['./addfeed.component.scss']
})
export class AddfeedComponent implements OnInit {
  addFeedForm: FormGroup;
  constructor(
    public fb: FormBuilder,
    public authService: AuthService,
    public router: Router
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
