import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private REST_API_SERVER = "http://localhost:3000/api/";

  constructor(private httpClient: HttpClient) { }
  public sendGetFodder(){
    return this.httpClient.get(this.REST_API_SERVER+"fodders");
  }
}
