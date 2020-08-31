import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Pet} from "../../model/Pet";
import {Fodder} from "../../model/Fodder";
@Injectable({
  providedIn: 'root'
})
export class DataService {

  private REST_API_SERVER = "http://localhost:3000/api/";
  private res: Pet[];

  constructor(private httpClient: HttpClient) {
  }
  public getFodder() : Promise<Fodder[]> {
    return this.httpClient.get(this.REST_API_SERVER + "fodders")
      .toPromise().then(res => res as Fodder[])
      .catch(this.handleError)
  }
  public getPets(): Promise<Pet[]> {
    return this.httpClient.get(this.REST_API_SERVER + "pets")
      .toPromise().then(res => res as Pet[])
      .catch(this.handleError)
  }
  public sendGetPets(){
    return this.httpClient.get(this.REST_API_SERVER+"pets");
  }
  public sendGetFeed(id: string){
    return this.httpClient.get(this.REST_API_SERVER+"feeds/"+id);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
