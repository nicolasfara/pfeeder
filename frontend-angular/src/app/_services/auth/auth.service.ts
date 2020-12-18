import {Injectable} from '@angular/core';
import {User} from '../../_models/User';
import {Observable, Subject, throwError} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import {Router} from '@angular/router';
import {Pet} from '../../_models/Pet';
import {Feed} from '../../_models/Feed';
import {changePsw} from '../../_models/changePsw';
import {Ration} from '../../_models/Ration';
import {WebsocketService} from '../notification/websocket.service';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})

export class AuthService {
  endpoint = 'http://' + environment.apiBaseUrl + ':3000/api';
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  currentUser = {};


  constructor(
    private http: HttpClient,
    public router: Router,
    private socketService: WebsocketService,
  ) {
  }

  // Change Password
  changePassword(changePassword: changePsw): Observable<any> {
    const api = `${this.endpoint}/users/password`;
    return this.http.post(api, changePassword).pipe(catchError(this.handleError));

  }




  // Sign-up
  signUp(user: User): Observable<any> {
    return this.http.post(`${this.endpoint}/users`, user).pipe(
      map((result: any) => {
        return  result || {};
      }),
      catchError(this.handleError)
    );
  }

  // Sign-in
  signIn(user: User): Observable<any>  {
    return this.http.post(`${this.endpoint}/users/login`, user).
    pipe(
      map((result: any) => {
          localStorage.setItem('access_token', result.token);
          sessionStorage.setItem('access_token', result.token);
          this.socketService.setupSocketConnection();
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

  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
  //  window.alert(errorMessage);
    return throwError(errorMessage);
  }
}
