import { Component, OnInit } from '@angular/core';
import {Pet} from "../shared/model/Pet";
import {DataService} from "../shared/service/data/data.service";

@Component({
  selector: 'app-showpet',
  templateUrl: './showpet.component.html',
  styleUrls: ['./showpet.component.scss']
})
export class ShowpetComponent implements OnInit {
  pets: Pet[];
  constructor(private service: DataService) { }

  ngOnInit(): void {
    this.getPet();
  }
  getPet(): void {
    this.service.getPets().then(pets => this.pets = pets);

  }
}
