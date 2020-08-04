import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import {DataService} from "../data.service";
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  fodders = [];

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.sendGetFodder().subscribe((data: any[])=>{
      console.log(data);
      this.fodders = data;
    })
  }
}
