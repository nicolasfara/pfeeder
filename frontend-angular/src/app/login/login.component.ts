import {Component, OnInit} from '@angular/core';
import {AuthService} from '../shared/service/auth/auth.service';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';

declare var $: any
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {


  signinForm: FormGroup;
  submitted = false;
  constructor(
    public fb: FormBuilder,
    public authService: AuthService,
    public router: Router
  ) {}
// convenience getter for easy access to form fields
  get f() { return this.signinForm.controls; }

  loginUser() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.signinForm.invalid) {
      return;
    }
    this.authService.signIn(this.signinForm.value);
  }

  ngOnInit(): void {
    this.signinForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]]
    });
  }
 }
