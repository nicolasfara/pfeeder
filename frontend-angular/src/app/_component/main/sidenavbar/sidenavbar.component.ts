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
  }

}
