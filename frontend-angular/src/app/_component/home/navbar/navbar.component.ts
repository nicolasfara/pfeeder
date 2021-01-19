import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../_services/auth/auth.service';

declare var $: any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  showBackDashboard: boolean;

  constructor(private service: AuthService) {
  }

  ngOnInit(): void {
    console.log(this.service.isLoggedIn);
    if (this.service.isLoggedIn === true) {
      this.showBackDashboard = true;
    }
    this.service.closeConnection.subscribe(() => {
      this.showBackDashboard = false;
    });
    $(document).on('click', '.openLogoutModal', () => {
      $('#logoutModal').appendTo('nav').modal('show');
    });
  }

}
