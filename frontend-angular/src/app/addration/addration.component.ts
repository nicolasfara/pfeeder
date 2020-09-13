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
  constructor(
    public fb: FormBuilder,
    public authService: AuthService,
    public router: Router,
    private dataService: DataService
  ) {

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
}
