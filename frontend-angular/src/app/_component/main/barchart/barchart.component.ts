import {Component, OnInit} from '@angular/core';
import {Pet} from '../../../_models/Pet';
import {DataService} from '../../../_services/data/data.service';
import {Color} from 'ng2-charts';
import {Feed} from '../../../_models/Feed';

@Component({
  selector: 'app-barchart',
  templateUrl: './barchart.component.html',
  styleUrls: ['./barchart.component.scss']
})
export class BarchartComponent implements OnInit {

  public pieChartLabels: string[] = [];
  public feeds: any = [];
  public pieChartData: any = [];
  public pieChartType = 'bar';
  public barChartLegend = false;


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
    this.fillBarChart();
    this.dataService.refreshNeeded.subscribe(() => {
      this.pieChartLabels = [];
      this.feeds = [];
      this.pieChartData = [];
      this.pets = [];
      this.fillBarChart();
    });
  }

  fillBarChart() {

    this.dataService.getPets().subscribe((data: Pet[]) => {
      this.pets = data;
      this.pets.forEach(value => this.pieChartLabels.push(value.name));
      this.pets.forEach(value => {
        // @ts-ignore
        this.dataService.getFeed(value._id.id.data).subscribe((f: Feed) => {
          this.feeds = f;
        });
        // @ts-ignore
        this.dataService.getCostPet(value._id.id.data).subscribe((cost: number) => {
          if (cost) {
            this.pieChartData[this.pets.indexOf(value)] = cost;
          }
        }, error => {
          this.pieChartData = [];
        });
      });
    });
  }

}
