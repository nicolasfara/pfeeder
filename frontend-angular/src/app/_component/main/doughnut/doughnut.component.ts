import {Component, OnInit} from '@angular/core';
import {DataService} from '../../../_services/data/data.service';
import {Pet} from '../../../_models/Pet';
import {Feed} from '../../../_models/Feed';
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

    // this.getPets();
    this.dataService.getPets().subscribe((data: Pet[]) => {
      this.pets = data;
      this.pets.forEach(value => {
        this.pieChartLabels.splice(this.pets.indexOf(value), 0, value.name);
      });
      const currentFeeds = [];
      this.pets.forEach(value => {
        // @ts-ignore
        this.dataService.getFeed(value._id.id.data)
          .subscribe((feeds: Feed[]) => {
            currentFeeds.push(feeds.reduce((sum, current) => sum + current.kcal, 0));
          });
      });
      this.feed = currentFeeds;
    });
    console.log(this.feed);
    this.feed.forEach(value1 => {
      this.pieChartData.push(value1);
    });
  }

  //
  // getPets() {
  //   this.dataService.getPets().subscribe((pet: Pet[]) => {
  //       this.pets = pet;
  //     },
  //     (error => {
  //       console.error('error caught in component');
  //       throw error;
  //     }));
  // }
}
