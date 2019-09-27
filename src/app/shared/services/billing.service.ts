import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class BillingService {

  private baseUrl:string = "https://azur.com.ec/plataforma/api/v2/factura/emision";

  constructor(private httpClient : HttpClient) { }

  public sendBill(obj){
    
    return this.httpClient.post(this.baseUrl,obj, {
      headers: new HttpHeaders({
           'Content-Type':  'application/json',
         })
    }).map(data=>
     data);
  }
}
