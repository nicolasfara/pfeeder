import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Pet} from '../../_models/Pet';
import {Fodder} from '../../_models/Fodder';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class DataService {
  endpoint = 'http://' + environment.apiBaseUrl + '/api';

  constructor(private httpClient: HttpClient) {
  }


  public getFodder(): Promise<any> {
    return this.httpClient.get(this.endpoint + 'fodders')
      .toPromise().then(res => res as Fodder[])
      .catch(this.handleError);
  }
  public getPets(): Promise<any> {
    return this.httpClient.get(this.endpoint + 'pets')
      .toPromise().then(res => res as Pet[])
      .catch(this.handleError);
  }

  public getRation() {
    return this.httpClient.get(this.endpoint + 'rations');
  }

  public sendGetPets() {
    return this.httpClient.get(this.endpoint + 'pets');
  }

  public sendGetFeed(id: string) {
    return this.httpClient.get(this.endpoint + 'feeds/' + id);
  }

  public sendGetCostPet(id: string) {
    return this.httpClient.get(this.endpoint + 'feeds/' + id + '/cost');
  }

  // addFoder
  addFodder(fodder: Fodder): Observable<any> {
    const api = `${this.endpoint}/fodders`;
    return this.httpClient.post(api, fodder).pipe(
      map((result: any) => {
        return result || {};
      }),
      catchError(this.handleError)
    );
  }


  private handleError(error: HttpErrorResponse) {
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
