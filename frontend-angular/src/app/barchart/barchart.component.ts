import {Component, OnInit} from '@angular/core';
import {Pet} from "../shared/model/Pet";
import {Feed} from "../shared/model/Feed";
import {DataService} from "../shared/service/data/data.service";

@Component({
  selector: 'app-barchart',
  templateUrl: './barchart.component.html',
  styleUrls: ['./barchart.component.scss']
})
export class BarchartComponent implements OnInit {
  public pieChartLabels: string[] = []
  public pieChartData: number[] = []
  public pieChartType: string = 'bar';
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
  private pets: Pet[];

  public chartClicked(e: any): void {
    console.log(e);
  }

  // event on pie chart slice hover
  public chartHovered(e: any): void {
    console.log(e);
  }

  constructor(private dataService: DataService) {
  }

  ngOnInit(): void {

    this.dataService.sendGetPets().subscribe((data: Pet[]) => {
      this.pets = data;
      this.pets.forEach(value => this.pieChartLabels.push(value.name))
     this.pets.forEach(value => {
        this.dataService.sendGetCostPet(buf2hex(value._id['id']['data'])).subscribe((data: Number) =>{
          this.pieChartData.push(data)
        })
      })
    })
  }

}

function buf2hex(buffer) { // buffer is an ArrayBuffer
  return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}
