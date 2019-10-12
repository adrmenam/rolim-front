import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map'

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  private baseUrl:string = "http://198.199.69.76:3000/info";

  constructor(private httpClient : HttpClient) { }

  public getConfiguration(){
    let transaction = 
    {
      "transaccion": "configuracionesGenerales"
    }
      
    return this.httpClient.post(this.baseUrl,transaction, {
      headers: new HttpHeaders({
           'Content-Type':  'application/json'
         })
    }).map(data=>
     data);
  }
}
