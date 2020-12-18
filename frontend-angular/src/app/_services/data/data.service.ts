import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Pet} from '../../_models/Pet';
import {Fodder} from '../../_models/Fodder';
import {Observable, Subject, throwError} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {Ration} from '../../_models/Ration';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  endpoint = 'http://' + environment.apiBaseUrl + ':3000/api';
  private refreshNeeded$ = new Subject<void>();

  constructor(private httpClient: HttpClient) {
  }

  /* For real time update */
  get refreshNeeded() {
    return this.refreshNeeded$;
  }

  /* Fodder API */
  public getFodder(): Promise<any> {
    return this.httpClient.get(this.endpoint + '/fodders').pipe()
      .toPromise().then(res => res as Fodder[])
      .catch(this.handleError);
  }

  // addFodder
  addFodder(fodder: Fodder): Observable<any> {
    const api = `${this.endpoint}/fodders`;
    return this.httpClient.post(api, fodder).pipe(
      tap(() => {
        this.refreshNeeded$.next();
      }));
  }

  // patchFodder
  patchFodder(fodderID, fodder: Fodder): Observable<any> {
    const api = `${this.endpoint}` + '/fodders/' + fodderID;
    return this.httpClient.post(api, fodder).pipe(
      map((result: any) => {
        return result || {};
      }),
      catchError(this.handleError)
    );
  }


  /* Pet API */
  public getPets(): Observable<Pet[]> {
    return this.httpClient.get(this.endpoint + '/pets').pipe(
      map((result: Pet[]) => {
        return result;
      }),
      catchError(this.handleError)
    );
  }

// addPet
  addPet(pet: Pet): Observable<any> {
    const api = `${this.endpoint}/pets`;
    return this.httpClient.post(api, pet)
      .pipe(
        tap(() => {
          this.refreshNeeded$.next();
        }));

  }

  // patch
  patchPet(pet: Pet, id: string): Observable<any> {
    const api = `${this.endpoint}/pets/` + id;
    return this.httpClient.post(api, pet)
      .pipe(
        catchError(this.handleError)
      );
  }

  /* Ration API */

  public getRation() {
    return this.httpClient.get(this.endpoint + '/rations');
  }

  public getRationByID(petID: string): Observable<Ration>{
    return this.httpClient.get(this.endpoint + '/rations/' + petID).pipe(
      map((result: Ration) => {
        return result;
      }),
      catchError(this.handleError)
    );
  }
  // addRation
  addRation(ration: Ration, id: string): Observable<any> {
    const api = `${this.endpoint}/rations/` + id;
    return this.httpClient.post(api, ration);
  }


  /* Cost API */

  public sendGetCostPet(id: string) {
    return this.httpClient.get(this.endpoint + '/feeds/' + id + '/cost');
  }

  public sendGetFeed(id: string) {
    return this.httpClient.get(this.endpoint + '/feeds/' + id);
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
