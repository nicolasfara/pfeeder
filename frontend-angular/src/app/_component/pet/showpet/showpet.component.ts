import { Component, OnInit } from '@angular/core';
import {Pet} from "../../../_models/Pet";
import {DataService} from "../../../_services/data/data.service";
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

    $(document).on("click", ".openAddPetSaveModal", function () {


      const name = $(this).closest('td').prevAll('.name').text();
      const weight = $(this).closest('td').prevAll('.weight').text().replace(' kg', '');
      const idealWeight = $(this).closest('td').prevAll('.idealWeight').text().replace(' kg', '');
      const age = $(this).closest('td').prevAll('.age').text().replace(' years', '');
      const petType = $(this).closest('td').prevAll('.petType').text();
      const breed = $(this).closest('td').prevAll('.breed').text();

      const trueWeight : number = +weight

      $(".modal-body #name").val(name).change();
      $(".modal-body #weight").val(trueWeight);
      $(".modal-body #idealWeight").val(idealWeight);
      $(".modal-body #age").val(age);
      $(".modal-body #petType").val(petType);
      $(".modal-body #breed").val(breed);

      $(".modal-body #fodder").hide();
      $(".modal-body #addFodd").hide();
      $(".modal-body #addPetButton").hide();
      $(".modal-body #savePetButton").show();

      $('#AddPet').modal('show');
    });
  }
  getPet(): void {
    this.service.getPets().then(pets => this.pets = pets);

  }

}
