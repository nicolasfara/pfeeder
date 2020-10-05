import {Component, OnInit} from '@angular/core';
import {Fodder} from "../shared/model/Fodder";
import {DataService} from "../shared/service/data/data.service";
import {Pet} from "../shared/model/Pet";
import {Feed} from "../shared/model/Feed";
import {Color} from "ng2-charts";

@Component({
  selector: 'app-doughnut',
  templateUrl: './doughnut.component.html',
  styleUrls: ['./doughnut.component.scss']
})
export class DoughnutComponent implements OnInit {
  pets: Pet[];
  feed: Feed[];
  hoverColor = [];

  public pieChartLabels: string[] = [];
  public pieChartData: number[] = [];
  public pieChartType: string = 'pie';
  colors: Color[] = [
    {
      backgroundColor: [
        "#e57373",
        "#7986cb",
        "#4fc3f7",
        "#ba68c8",
        "#81c784",
        "#9575cd",
        "#4dd0e1",
        "#4db6ac",
        "#f06292",
      ]
    }
  ];


  // events on slice click
  public chartClicked(e: any): void {

  }

  // event on pie chart slice hover
  private s: string;

  public chartHovered(e: any): void {

  }


  constructor(private dataService: DataService) {

  }

  ngOnInit(): void {

    this.getPets();
    this.dataService.sendGetPets().subscribe((data: Pet[]) => {
      this.pets = data;
      this.pets.forEach(value => this.pieChartLabels.splice(this.pets.indexOf(value), 0, value.name))
      this.pets.forEach(value => {
        //  this.s  = Buffer.from(value._id['id']['data']).toString("hex")
        this.s = buf2hex(value._id['id']['data'])
      })
      this.pets.forEach(value => this.dataService.sendGetFeed(buf2hex(value._id['id']['data'])).subscribe((data: Feed[]) => {
        this.feed = data
        this.feed.forEach(value1 => this.pieChartData.splice(this.pets.indexOf(value), 0, value1.quantity))
      }))
    })

    function buf2hex(buffer) { // buffer is an ArrayBuffer
      return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
    }
  }

  getPets() {
    this.dataService.getPets().then(pets => this.pets = pets);
  }
}
