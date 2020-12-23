import { Component, OnInit } from '@angular/core';
import {Ration} from '../../../_models/Ration';
import {DataService} from '../../../_services/data/data.service';

@Component({
  selector: 'app-showration',
  templateUrl: './showration.component.html',
  styleUrls: ['./showration.component.scss']
})
export class ShowrationComponent implements OnInit {
  errorMessage: string;
  showEditRation = false;
  modalTitle = 'Ration Dashboard';
  rations: Ration[] = [];
  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.getRation();
  }

  getRation(){
    this.dataService.getRation().subscribe((rations1: Ration[]) => {
        this.rations = rations1;
      },
      (error => {
        console.error('error caught in component');
        throw error;
      }));
  }
}
