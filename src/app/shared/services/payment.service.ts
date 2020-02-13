import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map'

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private baseUrl:string = "https://rolimapp.com:3000/usuarioActualizar";

  constructor(private httpClient : HttpClient) { }

  public registerCardToken(token, cardToken){
    let transaction = 
      {
        "transaccion": "registrarToken",
        "token": cardToken
      }
    return this.httpClient.post(this.baseUrl,transaction, {
      headers: new HttpHeaders({
           'Content-Type':  'application/json',
           'x-token': token
         })
    }).map(data=>
     data);
  }

  public getCardTokens(token){
    let transaction = 
      {
        "transaccion": "consultarToken"
      }
    return this.httpClient.post(this.baseUrl,transaction, {
      headers: new HttpHeaders({
           'Content-Type':  'application/json',
           'x-token': token
         })
    }).map(data=>
     data);
  }
}
