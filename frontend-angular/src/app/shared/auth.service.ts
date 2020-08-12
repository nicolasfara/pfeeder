import { Injectable } from '@angular/core';
import { User } from './model/User';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import {Pet} from "./model/Pet";
import {Feed} from "./model/Feed";
import {logger} from "codelyzer/util/logger";

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  endpoint = 'http://localhost:3000/api';
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  currentUser = {};

  constructor(
    private http: HttpClient,
    public router: Router
  ) {
  }

  //addPet
  addPet(pet: Pet): Observable<any> {
    const api = `${this.endpoint}/pet`;
    return this.http.post(api, pet)
      .pipe(
        catchError(this.handleError)
      );
  }
  //addFeed
  addFeed(feed: Feed): Observable<any> {
    const api = `${this.endpoint}/feed`;
    return this.http.post(api, feed)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Sign-up
  signUp(user: User): Observable<any> {
    const api = `${this.endpoint}/users`;
    return this.http.post(api, user)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Sign-in
  signIn(user: User) {
    return this.http.post<any>(`${this.endpoint}/users/login`, user)
      .subscribe((result: any) => {
        localStorage.setItem('access_token', result.token);

          this.currentUser = result.token;


        this.router.navigate(['/dashboard']);
      });
  }

  getToken() {
    return localStorage.getItem('access_token');
  }

  get isLoggedIn(): boolean {
    const authToken = localStorage.getItem('access_token');
    return (authToken !== null);
  }

  doLogout() {
    const removeToken = localStorage.removeItem('access_token');
    if (removeToken == null) {
      this.router.navigate(['log-in']);
    }
  }

  //Get User
  getCurrentUser(){
    return this.http.get(this.endpoint+"/users");
  }

  // User profile
  getUserProfile(id): Observable<any> {
    const api = `${this.endpoint}/dashboard/${id}`;
    return this.http.get(api, { headers: this.headers }).pipe(
      map((res: Response) => {
        return res || {};
      }),
      catchError(this.handleError)
    );
  }

  // Error
  handleError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      msg = error.error.message;
    } else {
      // server-side error
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(msg);
  }
}
