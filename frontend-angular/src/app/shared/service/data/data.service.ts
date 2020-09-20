import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Pet} from "../../model/Pet";
import {Fodder} from "../../model/Fodder";
import * as mongoose from 'mongoose';
import {Ration} from "../../model/Ration";
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

  public getRation(id:string) {
    return this.httpClient.get(this.REST_API_SERVER + "pets/" + id + "/rations")
     // .toPromise().then(res => res as Ration[])
      //.catch(this.handleError)
  }
  public sendGetPets(){
    return this.httpClient.get(this.REST_API_SERVER+"pets");
  }
  public sendGetFeed(id: string){
    return this.httpClient.get(this.REST_API_SERVER+"feeds/"+id);
  }
  public sendGetCostPet(id: string){
    return this.httpClient.get(this.REST_API_SERVER+"feeds/"+id+"/cost");
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
