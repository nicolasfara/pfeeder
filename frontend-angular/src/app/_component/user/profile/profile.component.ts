import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';
import {User} from '../../../_models/User';
import {FormBuilder, FormGroup} from '@angular/forms';
import {AuthService} from '../../../_services/auth/auth.service';
import {first} from 'rxjs/operators';
// TODO CHANGE PSW
// TODO CHANGE NAME,SUR,EMAIL
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  currentUser: User;
  currentEmail: string;
  gravatar: string;
  editProfileForm: FormGroup;
  changePasswordForm: FormGroup;

  constructor(
    public fb: FormBuilder,
    public authService: AuthService,
    public router: Router) {
    this.editProfileForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      picture: ['']
    });
    this.changePasswordForm = this.fb.group({
      oldPassword: [''],
      password: [''],
      confirmPassword: ['']
    });
  }

  editProfile() {
    this.authService.signUp(this.editProfileForm.value).pipe(first())
      .subscribe(
        data => {

        });
  }

  changePassword() {
    console.log(this.changePasswordForm);
    this.authService.changePassword(this.changePasswordForm.value).pipe(first()).subscribe(data => {
      console.log('ok!!');


    });
  }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((data: User) => {
      this.currentUser = data;
      this.currentEmail = this.currentUser.email.split('@', 2)[0];
      this.gravatar = this.currentUser.profile.picture;
    });
  }

}
