import {Component, OnInit} from '@angular/core';

declare var $: any
import {DataService} from "../shared/service/data/data.service";
import {Pet} from "../shared/model/Pet";
import {Chart, ChartDataSets, ChartOptions} from 'chart.js';
import {nullSafeIsEquivalent} from "@angular/compiler/src/output/output_ast";
import {Ration} from "../shared/model/Ration";


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  fodders = [];
  pets: Pet[];
  rations: Ration[];

  hours: string;

  constructor(private service: DataService) {
  }

  ngOnInit(): void {

    this.getPet();
    this.getFodder()
    this.getRation()

    $(document).on("click", ".openRationModal", function () {


      const petName = $(this).closest('td').prevAll('.petName').text();
      const petRationGrams = $(this).closest('td').prevAll('.petRationGrams').text().replace(' g', '')
      const rationTime = $(this).closest('td').prevAll('.rationTime').text()
      const hourTime = rationTime.substr(0, 2)
      const minuteTime = rationTime.substr(3, 5).replace(' PM', '')
      const ration: number = +petRationGrams
      const hourRation: number = +hourTime
      const minuteRation: number = +minuteTime
      $(".modal-body #petName").val(petName);
      $(".modal-body #ration").val('');
      $(".modal-body #hours").val('');
      $(".modal-body #minutes").val('');
      if (ration > 0) {
        $(".modal-body #ration").val(ration);
      }
      if (hourRation > 0) {
        $(".modal-body #hours").val(hourRation);
      }
      if (minuteRation > 0) {
        $(".modal-body #minutes").val(minuteRation);
      }
      $('#AddRation').modal('show');
    });

  }

  getPet(): void {
    this.service.getPets().then(pets => this.pets = pets);

  }

  getFodder(): void {
    this.service.getFodder().then(fodders => this.fodders = fodders);
  }

  getRation(): void {
    this.service.sendGetPets().subscribe((data: Pet[]) => {
      this.pets = data;
      this.pets.forEach(value => this.service.getRation(buf2hex(value._id['id']['data'])).subscribe((data: Ration) => {
        if (Array.isArray(data) && data.length) {
          this.rations = data
          /* NOT WORKING BECAUSE EVERY GET RETURN 1 RATION */
          //this.rations.insert(this.pets.indexOf(value),data)
          console.log(this.rations)
        }
      }))

    })
  }


  doesExist(time: Date): boolean {
    return time.toDateString() != ""
  }

}


function buf2hex(buffer) { // buffer is an ArrayBuffer
  return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}

/*Array.prototype.insert = function ( index, item ) {
  this.splice( index, 0, item );
};*/
