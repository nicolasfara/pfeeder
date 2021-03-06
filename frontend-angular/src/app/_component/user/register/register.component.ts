import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../_services/auth/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  signupForm: FormGroup;
  errorMessage;
  errorMessage2;
  submitted = false;
  gender = [
    'male',
    'female'
  ];
  constructor(
    public fb: FormBuilder,
    public authService: AuthService,
    public router: Router
  ) {
  }

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  get form() {
    return this.signupForm.controls;
  }

  async registerUser() {
    this.submitted = true;
    this.errorMessage = '';
    this.errorMessage2 = '';
    if (this.signupForm.invalid) {
      return;
    }
    if (this.signupForm.get('gender').value === 'gender') {
      console.error('error caught in component');
      this.errorMessage2 = 'Error select gender';
    } else {

      this.authService.signUp(this.signupForm.value).subscribe(() => {
          this.router.navigate(['/login']);
        },
        (error => {
          console.error('error caught in component');
          this.errorMessage = error;
          throw error;
        }));
    }
  }

  back() {
    this.router.navigate(['homepage']).then();
  }
}
