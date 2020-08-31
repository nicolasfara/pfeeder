import { Component, OnInit } from '@angular/core';
declare var $ : any
import {DataService} from "../shared/service/data/data.service";
import {Pet} from "../shared/model/Pet";
import { Chart, ChartDataSets, ChartOptions } from 'chart.js';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  fodders = [];
  pets : Pet[];
  hours: string;
  private ctx: any;
  private myPieChart: Chart;


  constructor(private service : DataService) { }

  ngOnInit(): void {
    this.getPet();
    this.getFodder()

    $(document).on("click", ".openRationModal", function () {
      var petName = $(this).closest('td').prevAll('.petName').text();
      $(".modal-body #petName").val( petName );
       $('#AddRation').modal('show');
    });

  }

  getPet(): void {
    this.service.getPets().then(pets => this.pets = pets);
  }
  getFodder() :void {
    this.service.getFodder().then(fodders => this.fodders = fodders);
  }
}


