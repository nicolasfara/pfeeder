import {Component, OnInit} from '@angular/core';
import {Fodder} from "../shared/model/Fodder";
import {DataService} from "../shared/service/data/data.service";
import {Pet} from "../shared/model/Pet";
import {Feed} from "../shared/model/Feed";

@Component({
  selector: 'app-doughnut',
  templateUrl: './doughnut.component.html',
  styleUrls: ['./doughnut.component.scss']
})
export class DoughnutComponent implements OnInit {
  pets: Pet[];
  feed: Feed[];
  public pieChartLabels: string[] = [];
  public pieChartData: number[] = [];
  public pieChartType: string = 'pie';
  public pieChartOptions: any = {
    'backgroundColor': [
      "#FF6384",
      "#4BC0C0",
      "#FFCE56",
      "#E7E9ED",
      "#36A2EB"
    ]
  }


  // events on slice click
  public chartClicked(e: any): void {

  }

  // event on pie chart slice hover
  public chartHovered(e: any): void {

  }


  constructor(private dataService: DataService) {
  }

  ngOnInit(): void {

    this.getPets();
    this.dataService.sendGetPets().subscribe((data: Pet[]) => {
      this.pets = data;
      this.pets.forEach(value => this.pieChartLabels.push(value.name))
      /* this.pets.forEach(value => console.log(btoa(value._id.toString())))
       this.pets.forEach(value => this.dataService.sendGetFeed(btoa(value._id.toString())).subscribe((data: Feed[])=>{

          this.feed.forEach(value1 => this.pieChartData.push(value1.kcal))
        }))*/
    })


  }
  getPets() {
    this.dataService.getPets().then(pets => this.pets = pets);
  }
}
