import { Component, OnInit } from '@angular/core';
declare var $ : any
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import {DataService} from "../shared/service/data/data.service";
import {Pet} from "../shared/model/Pet";
import {Fodder} from "../shared/model/Fodder";
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  fodders = [];
  pets = [];
  hours: string;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.sendGetFodder().subscribe((data: Fodder[])=>{
      console.log(data);
      this.fodders = data;

    })
    this.dataService.sendGetPets().subscribe((data: Pet[])=>{
      console.log(data);
      this.pets = data;
    })

    $(document).on("click", ".openRationModal", function () {
      var petName = $(this).closest('td').prevAll('.petName').text();
      $(".modal-body #petName").val( petName );
       $('#AddRation').modal('show');
    });

  }
}
