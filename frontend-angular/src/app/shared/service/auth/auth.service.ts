import {Injectable} from '@angular/core';
import {User} from '../../model/User';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import {Router} from '@angular/router';
import {Pet} from '../../model/Pet';
import {Feed} from '../../model/Feed';
import {changePsw} from '../../model/changePsw';
import {Fodder} from '../../model/Fodder';
import {Ration} from '../../model/Ration';

import {io} from 'socket.io-client/build/index';
import {WebsocketService} from '../../../websocket.service';
@Injectable({
  providedIn: 'root'
})

export class AuthService {
  endpoint = 'http://localhost:3000/api';
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  currentUser = {};
  constructor(
    private http: HttpClient,
    public router: Router,
    private socket: WebsocketService
  ) {
  }

  // Change Password
  changePassword(changePassword: changePsw): Observable<any> {
    const api = `${this.endpoint}/users/password`;
    return this.http.post(api, changePassword).pipe(catchError(this.handleError));

  }

  // addPet
  addPet(pet: Pet): Observable<any> {
    const api = `${this.endpoint}/pets`;
    return this.http.post(api, pet)
      .pipe(
        catchError(this.handleError)
      );
  }

  // patch
  patchPet(pet: Pet, id: string): Observable<any> {
    const api = `${this.endpoint}/pets/` + id;
    return this.http.post(api, pet)
      .pipe(
        catchError(this.handleError)
      );
  }

  // addFoder
  addFodder(fodder: Fodder): Observable<any> {
    const api = `${this.endpoint}/fodders`;
    return this.http.post(api, fodder)
      .pipe(
        catchError(this.handleError)
      );
  }

  // addFeed
  addFeed(feed: Feed): Observable<any> {
    const api = `${this.endpoint}/feeds`;
    return this.http.post(api, feed)
      .pipe(
        catchError(this.handleError)
      );
  }

  // addRation
  addRation(ration: Ration, id: string): Observable<any> {
    const api = `${this.endpoint}/rations/` + id;
    return this.http.post(api, ration);
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
        console.log('LOGIN:' + result.token);
        localStorage.setItem('access_token', result.token);
        sessionStorage.setItem('access_token', result.token);
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
    this.router.navigate(['/homepage']);
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
