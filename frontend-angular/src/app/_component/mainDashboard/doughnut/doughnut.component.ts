import {Component, OnInit} from '@angular/core';
import {DataService} from '../../../_services/data/data.service';
import {Pet} from '../../../_models/Pet';
import {Feed} from '../../../_models/Feed';
import {Color} from 'ng2-charts';
// TODO TEST WITH FEED INSERT
@Component({
  selector: 'app-doughnut',
  templateUrl: './doughnut.component.html',
  styleUrls: ['./doughnut.component.scss']
})
export class DoughnutComponent implements OnInit {


  constructor(private dataService: DataService) {
  }

  pets: Pet[];
  feed: Feed[];
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

  // event on pie chart slice hover
  private s: string;


  // events on slice click
  public chartClicked(e: any): void {

  }

  public chartHovered(e: any): void {

  }

  ngOnInit(): void {

    this.getPets();
    this.dataService.getPets().subscribe((data: Pet[]) => {
      this.pets = data;
      this.pets.forEach(value => this.pieChartLabels.splice(this.pets.indexOf(value), 0, value.name));
      // @ts-ignore
      this.pets.forEach((value: Pet) => this.dataService.sendGetFeed(buf2hex(value._id.id.data))
        .subscribe((feeds: Feed[]) => {
          this.feed = feeds;
          if (this.feed.length > 0) {
            this.feed.forEach(value1 => this.pieChartData[this.pets.indexOf(value)] = value1.quantity);
          }
        }));
    });
  }

  getPets() {
    this.dataService.getPets().subscribe((pet: Pet[]) => {
      this.pets = pet;
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
