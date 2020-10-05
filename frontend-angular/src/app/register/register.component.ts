import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {AuthService} from '../shared/service/auth/auth.service';
import {Router} from '@angular/router';
import {logger} from "codelyzer/util/logger";
import {first} from "rxjs/operators";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  signupForm: FormGroup;
  constructor(
    public fb: FormBuilder,
    public authService: AuthService,
    public router: Router
  ) {
    this.signupForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      gender: [''],
      email: [''],
      password: [''],

    });
  }
  ngOnInit(): void {
  }

  registerUser() {
    this.authService.signUp(this.signupForm.value) .pipe(first())
      .subscribe(
        data => {
          this.router.navigate(['/login']);
        });
  }
}
