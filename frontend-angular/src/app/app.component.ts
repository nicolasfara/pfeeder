import {Component, OnInit} from '@angular/core';

import * as AOS from 'aos';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'frontend-angular';
  constructor( ){ }
  ngOnInit() {
    AOS.init();
  }
}
