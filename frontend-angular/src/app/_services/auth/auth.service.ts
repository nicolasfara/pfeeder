import {Injectable} from '@angular/core';
import {User} from '../../_models/User';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import {Router} from '@angular/router';
import {ChangePsw} from '../../_models/ChangePsw';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  api = environment.apiBaseUrl;
  endpoint: string;
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  currentUser = {};


  constructor(
    private http: HttpClient,
    public router: Router
  ) {
    if (this.api === 'localhost') {
      this.api = this.api.concat(':3000');
    }
    this.endpoint = 'http://' + this.api + '/api';
  }

  // Change Password
  changePassword(changePassword: ChangePsw): Observable<any> {
    const api = `${this.endpoint}/users/password`;
    return this.http.post(api, changePassword).pipe(catchError(this.handleError));
  }


  // Sign-up
  signUp(user: User): Observable<any> {
    return this.http.post(`${this.endpoint}/users`, user).pipe(
      map((result: any) => {
        return result || {};
      }),
      catchError(this.handleError)
    );
  }

  // Sign-in
  signIn(user: User): Observable<any> {
    return this.http.post(`${this.endpoint}/users/login`, user).pipe(
      map((result: any) => {
        localStorage.setItem('access_token', result.token);
        return result || {};
      }),
      catchError(this.handleError)
    );
  }

  getToken() {
    return localStorage.getItem('access_token');
  }

  get isLoggedIn(): boolean {
    const authToken = localStorage.getItem('access_token');
    return (authToken !== null);
  }

  doLogout() {
    this.router.navigate(['/homepage']).then();
  }

  // get User
  getCurrentUser() {
    return this.http.get(this.endpoint + '/users');
  }

  // User profile
  getUserProfile(id): Observable<any> {
    const api = `${this.endpoint}/dashboard/${id}`;
    return this.http.get(api, {headers: this.headers}).pipe(
      map((res: Response) => {
        return res || {};
      }),
      catchError(this.handleError)
    );
  }

  forgotPsw(email): Observable<string> {
    return  this.http.post(this.endpoint + '/users/forgot', email)
      .pipe(
        map((res: string) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  resetPsw(token: string, psw): Observable<any> {
    return  this.http.post(this.endpoint + '/users/reset/' + token, psw)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }
  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}
