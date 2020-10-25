import { Component, OnInit } from '@angular/core';
import {AuthService} from '../shared/service/auth/auth.service';
import {User} from "../shared/model/User";
import {Router} from "@angular/router";
declare var $: any
@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {

  currentUser :User
  currentEmail : string
  gravatar : string
  constructor(public authService: AuthService, public router: Router) { }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((data: User)=>{
      console.log(data);
      this.currentUser = data
      this.currentEmail = this.currentUser.email.split('@', 2)[0]
      this.gravatar = this.currentUser.profile.picture
    })


    $(document).on("click", ".openLogoutModal", function () {
      $('#logoutModal').appendTo("body").modal('show');
    })
  }

  goToProfile(){
    this.router.navigate(['/profile']);
  }
}