import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../_services/auth/auth.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';

declare var $: any;
 // TODO GESTIRE PSW DIMENTICATA

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
  }

  openForgot() {
    this.showForgot = true;
  }
}
