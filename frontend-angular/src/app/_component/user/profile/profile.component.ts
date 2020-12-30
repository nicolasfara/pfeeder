import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {User} from '../../../_models/User';
import {FormBuilder, FormGroup} from '@angular/forms';
import {AuthService} from '../../../_services/auth/auth.service';

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
  errorMessage: string;
  openPsw = false;

  constructor(
    public fb: FormBuilder,
    public authService: AuthService,
    public router: Router) {
    this.editProfileForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: ['']
    });
    this.changePasswordForm = this.fb.group({
      oldPassword: [''],
      password: [''],
      confirmPassword: ['']
    });
  }

  editProfile(editProfileForm) {
    this.authService.patchUser(editProfileForm.value)
      .subscribe(() => {
          this.router.navigate(['/dashboard']).then();
        },
        (error => {
          console.error('error caught in component');
          this.errorMessage = error;
          throw error;
        }));
  }

  changePassword() {
    this.authService.changePassword(this.changePasswordForm.value)
      .subscribe(() => {
          this.router.navigate(['/login']).then();
        },
        (error => {
          console.error('error caught in component');
          this.errorMessage = error;
          throw error;
        }));
  }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((data: User) => {
      this.currentUser = data;
      this.currentEmail = this.currentUser.email.split('@', 2)[0];
      this.gravatar = this.currentUser.profile.picture;

      this.editProfileForm = this.fb.group({
        firstName: this.currentUser.profile.firstName,
        lastName: this.currentUser.profile.lastName,
        email: this.currentUser.email
      });
    });
  }

  openChangePassword() {
    this.openPsw = true;
  }
}
