import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Pet} from '../../_models/Pet';
import {Fodder} from '../../_models/Fodder';
import {Observable, throwError} from "rxjs";
import {catchError, map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private REST_API_SERVER = 'http://localhost:3000/api/';
  private res: Pet[];
  endpoint = 'http://localhost:3000/api';

  constructor(private httpClient: HttpClient) {
  }

  // public getFodder(): Observable<any> {
  //   const api = `${this.endpoint}/fodders`;
  //   return this.httpClient.get(api).pipe(
  //     map((result: Fodder[]) => {
  //       return result || {};
  //     }),
  //     catchError(this.handleError)
  //   );
  // }
  public getFodder(): Promise<any> {
    return this.httpClient.get(this.REST_API_SERVER + 'fodders')
      .toPromise().then(res => res as Fodder[])
      .catch(this.handleError);
  }
  public getPets(): Promise<any> {
    return this.httpClient.get(this.REST_API_SERVER + 'pets')
      .toPromise().then(res => res as Pet[])
      .catch(this.handleError)
  }

  // public getPets(): Observable<any> {
  //   const api = `${this.endpoint}/pets`;
  //   return this.httpClient.get(api)
  //     .pipe(
  //       map((result: Pet[]) => {
  //         return result || {};
  //       }),
  //       catchError(this.handleError)
  //     );
  // }

  public getRation() {
    return this.httpClient.get(this.REST_API_SERVER + 'rations');
  }

  public sendGetPets() {
    return this.httpClient.get(this.REST_API_SERVER + 'pets');
  }

  public sendGetFeed(id: string) {
    return this.httpClient.get(this.REST_API_SERVER + 'feeds/' + id);
  }

  public sendGetCostPet(id: string) {
    return this.httpClient.get(this.REST_API_SERVER + 'feeds/' + id + '/cost');
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
