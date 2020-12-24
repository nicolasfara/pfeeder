import {Component, OnInit} from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-sidenavbar',
  templateUrl: './sidenavbar.component.html',
  styleUrls: ['./sidenavbar.component.scss']
})
export class SidenavbarComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {

    $(document).ready(() => {
      $('#sidebarToggle, #sidebarToggleTop').on('click', () => {
        $('body').toggleClass('sidebar-toggled');
        $('.sidebar').toggleClass('toggled');
        if ($('.sidebar').hasClass('toggled')) {
          $('.sidebar .collapse').collapse('hide');
        }
      });
    });


    $(document).on('click', '.openAddPetModal', () => {

      $('.modal-body #name').val('');
      $('.modal-body #weight').val('');
      $('.modal-body #idealWeight').val('');
      $('.modal-body #age').val('');
      $('.modal-body #petType').val('');
      $('.modal-body #breed').val('');
      $('.modal-body #fodder').show();
      $('.modal-body #addFodd').show();
      $('.modal-body #savePetButton').hide();
      $('.modal-body #addPetButton').show();
      $('.AllPet').append('#AddPet');
      $('#AddPet').modal('show');
    });
  }

}
