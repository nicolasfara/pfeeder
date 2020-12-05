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

  // @ts-ignore
  constructor(
    public fb: FormBuilder,
    public authService: AuthService,
    public router: Router
  ) {
    this.signinForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
  });
  }
  ngOnInit(): void {
  }

  loginUser() {
    this.authService.signIn(this.signinForm.value);
  }
 }
