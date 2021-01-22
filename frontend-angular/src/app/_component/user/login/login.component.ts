import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../_services/auth/auth.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  signInForm: FormGroup;
  submitted = false;
  errorMessage;

  showForgot = false;
  forgotPswForm: FormGroup;
  returnToken: string;
  showReset = false;
  resetPswForm: FormGroup;

  constructor(
    public fb: FormBuilder,
    public authService: AuthService,
    public router: Router
  ) {
  }

  get f() {
    return this.signInForm.controls;
  }

  async loginUser() {
    this.submitted = true;
    this.errorMessage = '';
    if (this.signInForm.invalid) {
      return;
    }
    this.authService.signIn(this.signInForm.value).subscribe(() => {
        this.router.navigate(['/dashboard']);
      },
      (error => {
        console.error('error caught in component');
        this.errorMessage = error;
        throw error;
      }));
  }

  ngOnInit(): void {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]]
    });
    this.forgotPswForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.resetPswForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(5)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  openForgot() {
    this.showForgot = true;
  }

  forgotPsw() {
    this.authService.forgotPsw(this.forgotPswForm.value).subscribe((token: any) => {
      this.showReset = true;
      this.returnToken = token.token;
    });
  }

  resetPassword() {
    this.authService.resetPsw(this.returnToken, this.resetPswForm.value)
      .subscribe(() => {
          this.showReset = false;
          this.showForgot = false;
          this.router.navigate(['/login']).then();
        },
        (error => {
          console.error('error caught in component');
          this.errorMessage = error;
          throw error;
        }));
  }

  back() {
    this.router.navigate(['homepage']).then();
  }
}
