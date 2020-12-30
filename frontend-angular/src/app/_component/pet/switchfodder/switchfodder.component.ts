import { Component, OnInit } from '@angular/core';
import {Pet} from '../../../_models/Pet';
import {Fodder} from "../../../_models/Fodder";
import {DataService} from "../../../_services/data/data.service";

@Component({
  selector: 'app-switchfodder',
  templateUrl: './switchfodder.component.html',
  styleUrls: ['./switchfodder.component.scss']
})
export class SwitchfodderComponent implements OnInit {

  pets: Pet[] = [];
  fodders = [];
  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.getPet();
  }
  getPet(): void {
    this.dataService.getPets().subscribe(
      (pet: Pet[]) => {
        this.pets = pet;
        this.pets.forEach(x => this.dataService.getFodderByPet(buf2hex(x._id.id.data)).subscribe((fodder: Fodder) => {
          this.fodders.push(fodder.currentFodder.name);
        }));
      },
      (error => {
        console.error('error caught in component');
        throw error;
      }));

  }
}

function buf2hex(buffer) { // buffer is an ArrayBuffer
  return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}
