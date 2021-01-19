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

  constructor(private httpClient: HttpClient) {
    if (environment.apiBaseUrl === 'localhost') {
      this.endpoint = 'http://' + environment.apiBaseUrl + ':3000/api';
    } else {
      this.endpoint = 'http://' + environment.apiBaseUrl + '/api';
    }
  }

  /* For real time update */
  get refreshNeeded() {
    return this.refreshNeeded$;
  }

  endpoint = '';
  private refreshNeeded$ = new Subject<void>();

  /** Function to handle error in server request */
  private static handleError(error: HttpErrorResponse) {
    let errorMessage: string;
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }

  /* Fodder API */
  public getFodder(): Promise<any> {
    return this.httpClient.get(this.endpoint + '/fodders').pipe()
      .toPromise().then(res => res as Fodder[])
      .catch(DataService.handleError);
  }

  // addFodder
  addFodder(fodder: Fodder): Observable<any> {
    const api = `${this.endpoint}/fodders`;
    return this.httpClient.post(api, fodder)
      .pipe(
        map((result: any) => {
          return result || {};
        }),
        tap({
          next: () => {
            this.refreshNeeded$.next();
          },
          error: () => {
            catchError(DataService.handleError);
          }
        })
      );
  }

  // patchFodder
  patchFodder(fodderID, fodder: Fodder): Observable<any> {
    const api = `${this.endpoint}` + '/fodders/' + this.buf2hex(fodderID);
    return this.httpClient.patch(api, fodder)
      .pipe(
        map((result: any) => {
          return result || {};
        }),
        tap({
          next: () => {
            this.refreshNeeded$.next();
          },
          error: () => {
            catchError(DataService.handleError);
          }
        })
      );
  }


  /* Pet API */
  public getFodderByPet(petId: string): Observable<any> {
    return this.httpClient.get(this.endpoint + '/pets/' + this.buf2hex(petId) + '/fodder').pipe(
      map((result: any) => {
        return result;
      }),
      catchError(DataService.handleError)
    );
  }

  deletePet(petId: string): Observable<any> {
    return this.httpClient.delete(this.endpoint + '/pets/' + this.buf2hex(petId))
      .pipe(
        map((result: any) => {
          return result || {};
        }),
        tap({
          next: () => {
            this.refreshNeeded$.next();
          },
          error: () => {
            catchError(DataService.handleError);
          }
        })
      );
  }

  public getPets(): Observable<Pet[]> {
    return this.httpClient.get(this.endpoint + '/pets').pipe(
      map((result: Pet[]) => {
        return result;
      }),
      catchError(DataService.handleError)
    );
  }

// addPet
  addPet(pet: Pet): Observable<any> {
    const api = `${this.endpoint}/pets`;
    return this.httpClient.post(api, pet)
      .pipe(
        map((result: any) => {
          return result || {};
        }),
        tap({
          next: () => {
            this.refreshNeeded$.next();
          },
          error: () => {
            catchError(DataService.handleError);
          }
        })
      );

  }

  patchFodderPet(petId: string, fodderId): Observable<any> {
    const api = `${this.endpoint}/pets/` + this.buf2hex(petId) + '/fodder';
    return this.httpClient.patch(api, fodderId)
      .pipe(
        map((result: any) => {
          return result;
        }),
        tap({
          next: () => {
            this.refreshNeeded$.next();
          },
          error: () => {
            catchError(DataService.handleError);
          }
        })
      );
  }

  // patch
  patchPet(pet: Pet, id: string): Observable<any> {
    const api = `${this.endpoint}/pets/` + this.buf2hex(id);
    return this.httpClient.patch(api, pet)
      .pipe(
        map((result: any) => {
          return result || {};
        }),
        tap({
          next: () => {
            this.refreshNeeded$.next();
          },
          error: () => {
            catchError(DataService.handleError);
          }
        })
      );
  }

  /** ------ Ration API  ------ */


  public getRation() {
    return this.httpClient.get(this.endpoint + '/rations');
  }

  patchRation(rationID, ration): Observable<any> {
    const api = `${this.endpoint}/rations/` + this.buf2hex(rationID);
    return this.httpClient.patch(api, ration)
      .pipe(
        map((result: any) => {
          return result || {};
        }),
        tap({
          next: () => {
            this.refreshNeeded$.next();
          },
          error: () => {
            catchError(DataService.handleError);
          }
        })
      );
  }

  public getRationByID(petID: string): Observable<Ration> {
    return this.httpClient.get(this.endpoint + '/rations/' + this.buf2hex(petID)).pipe(
      map((result: Ration) => {
        return result;
      }),
      catchError(DataService.handleError)
    );
  }

  deleteRation(rationId: string): Observable<any> {
    return this.httpClient.delete(this.endpoint + '/rations/' + this.buf2hex(rationId))
      .pipe(
        map((result: any) => {
          return result || {};
        }),
        tap({
          next: () => {
            this.refreshNeeded$.next();
          },
          error: () => {
            catchError(DataService.handleError);
          }
        })
      );
  }

  // addRation
  addRation(ration: Ration, id: string): Observable<any> {
    const api = `${this.endpoint}/rations/` + this.buf2hex(id);
    return this.httpClient.post(api, ration)
      .pipe(
        map((result: any) => {
          return result || {};
        }),
        tap({
          next: () => {
            this.refreshNeeded$.next();
          },
          error: () => {
            catchError(DataService.handleError);
          }
        })
      );
  }


  /** API to get cost for a particular pet */

  public getCostPet(id: string) {
    return this.httpClient.get(this.endpoint + '/feeds/' + this.buf2hex(id) + '/cost')
      .pipe(
        map((result: Ration) => {
          return result;
        }),
        catchError(DataService.handleError)
      );
  }

  /** API to get feed for a particular pet */
  public getFeed(id: string) {
    return this.httpClient.get(this.endpoint + '/feeds/' + this.buf2hex(id) + '/kcal')
      .pipe(
        map((result: number) => {
          return result;
        }),
        catchError(DataService.handleError)
      );
  }

  buf2hex(buffer) { // buffer is an ArrayBuffer
    return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
  }

}

