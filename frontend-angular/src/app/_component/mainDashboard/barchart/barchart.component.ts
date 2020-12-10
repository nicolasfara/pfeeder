import {Component, OnInit} from '@angular/core';
import {Pet} from '../../../_models/Pet';
import {DataService} from '../../../_services/data/data.service';
import {Color} from 'ng2-charts';

@Component({
  selector: 'app-barchart',
  templateUrl: './barchart.component.html',
  styleUrls: ['./barchart.component.scss']
})
export class BarchartComponent implements OnInit {

  public pieChartLabels: string[] = [];
  public feed: number[] = [];
  public pieChartData: any = [];
  public pieChartType = 'bar';
  public barChartLegend = false;


  // events on slice click
  private pets: Pet[];
  colors: Color[] = [
    {
      backgroundColor: [
        '#e57373',
        '#7986cb',
        '#4fc3f7',
        '#ba68c8',
        '#81c784',
        '#9575cd',
        '#4dd0e1',
        '#4db6ac',
        '#f06292',
      ]
    }
  ];


  constructor(private dataService: DataService) {
  }

  ngOnInit(): void {

    this.dataService.sendGetPets().subscribe((data: Pet[]) => {
      this.pets = data;
      this.pets.forEach(value => this.pieChartLabels.push(value.name));
      this.pets.forEach(value => {
        // tslint:disable-next-line:no-shadowed-variable
        // @ts-ignore
        // tslint:disable-next-line:no-shadowed-variable
        this.dataService.sendGetCostPet(buf2hex(value.id.id.data)).subscribe((data: number) => {
          this.pieChartData.splice(this.pets.indexOf(value), 0, data);
        });
      });
    });
  }

}

function buf2hex(buffer) { // buffer is an ArrayBuffer
  return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}
