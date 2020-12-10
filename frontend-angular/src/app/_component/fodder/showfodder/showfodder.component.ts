import {Component, OnInit} from '@angular/core';
import {DataService} from '../../../_services/data/data.service';


declare var $: any

@Component({
  selector: 'app-showfodder',
  templateUrl: './showfodder.component.html',
  styleUrls: ['./showfodder.component.scss'],

})
export class ShowfodderComponent implements OnInit {
  fodders = [];

  constructor(private service: DataService) {
  }

  ngOnInit(): void {
    this.getFodder();

    $(document).on('click', '.openUpdateFodder', function () {
      const name = $(this).closest('td').prevAll('.fodderName').text();
      const companyName = $(this).closest('td').prevAll('.companyName').text();
      const price = $(this).closest('td').prevAll('.price').text();
      const weight = $(this).closest('td').prevAll('.weight').text().replace(' kg', '');
      const trueWeight: number = +weight;
      const kcal = $(this).closest('td').prevAll('.kcal').text();
      const proteins = $(this).closest('td').prevAll('.proteins').text();
      const  fats = $(this).closest('td').prevAll('.fats').text();
      const  vitamins = $(this).closest('td').prevAll('.vitamins').text();
      const carbohydrates = $(this).closest('td').prevAll('.carbohydrates').text();
      const obj = { name, companyName, price, trueWeight, kcal, proteins, fats, vitamins, carbohydrates };
      const myJSON = JSON.stringify(obj);
      localStorage.setItem('currentFodder', myJSON);

      // $(".modal-body #fodderName").val(fodderName);
      // $(".modal-body #companyName").val(companyName);
      // $(".modal-body #price").val(price);
      // $(".modal-body #weight").val(weight);
      // $(".modal-body #kcal").val(kcal);
      // $(".modal-body #proteins").val(proteins);
      // $(".modal-body #fats").val(fats);
      // $(".modal-body #vitamins").val(vitamins);
      // $(".modal-body #carbohydrates").val(carbohydrates);

      $('#UpdateFodder').modal('show');
    });

  }

  getFodder(): void {
    this.service.getFodder().then(fodders => this.fodders = fodders);

  }
}

