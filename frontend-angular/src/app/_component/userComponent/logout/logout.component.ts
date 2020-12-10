import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../_services/auth/auth.service';

declare var $: any;

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {


  constructor(public authService: AuthService) {

  }

  ngOnInit(): void {

  }

  doLogOut() {
    $('body').remove('#logoutModal');
    $('#logoutModal').modal('hide');
    this.authService.doLogout();
  }

}
