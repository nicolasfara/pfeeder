import { Component, OnInit } from '@angular/core';
import {Pet} from "../shared/model/Pet";
import {DataService} from "../shared/service/data/data.service";
declare var $: any
@Component({
  selector: 'app-showpet',
  templateUrl: './showpet.component.html',
  styleUrls: ['./showpet.component.scss']
})
export class ShowpetComponent implements OnInit {
  pets: Pet[];
  constructor(private service: DataService) { }

  ngOnInit(): void {
    this.getPet();

    $(document).on("click", ".openAddPetModal", function () {


      const name = $(this).closest('td').prevAll('.name').text();
      const weight = $(this).closest('td').prevAll('.weight').text().replace(' kg', '');
      const idealWeight = $(this).closest('td').prevAll('.idealWeight').text().replace(' kg', '');
      const age = $(this).closest('td').prevAll('.age').text().replace(' years', '');
      const petType = $(this).closest('td').prevAll('.petType').text();
      const breed = $(this).closest('td').prevAll('.breed').text();

      const trueWeight : number = +weight
      $(".modal-body #name").val('');
      $(".modal-body #weight").val('');
      $(".modal-body #idealWeight").val('');
      $(".modal-body #age").val('');
      $(".modal-body #petType").val('');
      $(".modal-body #breed").val('');
      $(".modal-body #name").val(name);
      $(".modal-body #weight").val(trueWeight);
      $(".modal-body #idealWeight").val(idealWeight);
      $(".modal-body #age").val(age);
      $(".modal-body #petType").val(petType);
      $(".modal-body #breed").val(breed);

      $(".modal-body #fodder").hide();
      $(".modal-body #addFodd").hide();
      $(".modal-body #addPetButton").hide();
      $(".modal-body #savePetButton").show();
      $("body").append('#AddPet');
      $('#AddPet').modal('show');
    });
  }
  getPet(): void {
    this.service.getPets().then(pets => this.pets = pets);

  }

}
