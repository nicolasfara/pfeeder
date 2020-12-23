import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../_services/auth/auth.service';
import {User} from '../../../_models/User';
import {Router} from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {

  currentUser: User;
  currentEmail: string;
  gravatar: string;

  constructor(public authService: AuthService, public router: Router) {
  }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((data: User) => {
      this.currentUser = data;
      this.currentEmail = this.currentUser.email.split('@', 2)[0];
      this.gravatar = this.currentUser.profile.picture;
    });


    $(document).on('click', '.openLogoutModal', () => {
      $('#logoutModal').appendTo('body').modal('show');
    });
  }

  goToProfile() {
    this.router.navigate(['/profile']).then();
  }
}
