import {Component, OnInit} from '@angular/core';
import {DataService} from '../../../_services/data/data.service';
import {Pet} from '../../../_models/Pet';
import {Color} from 'ng2-charts';

@Component({
  selector: 'app-doughnut',
  templateUrl: './doughnut.component.html',
  styleUrls: ['./doughnut.component.scss']
})
export class DoughnutComponent implements OnInit {


  constructor(private dataService: DataService) {
  }

  pets: Pet[];
  feed = [];
  public pieChartLabels: string[] = [];
  public pieChartData: number[] = [];
  public pieChartType = 'pie';
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


  ngOnInit(): void {
    this.fillDoughnut();
    this.dataService.refreshNeeded.subscribe(() => {
      this.pets = [];
      this.feed = [];
      this.pieChartLabels = [];
      this.pieChartData = [];
      this.fillDoughnut();
    });
  }

  fillDoughnut() {
    this.dataService.getPets().subscribe((data: Pet[]) => {
      this.pets = data;
      this.pets.forEach(value => {
        this.pieChartLabels.splice(this.pets.indexOf(value), 0, value.name);
      });
      this.pets.forEach(value => {
        // @ts-ignore
        this.dataService.getFeed(value._id.id.data)
          .subscribe((kcal: number) => {
            this.pieChartData.splice(this.pets.indexOf(value), 0, kcal);
          },
            () => {
            this.pieChartData = [];
            });
      });
    });
  }
}
