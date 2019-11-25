import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map'
import { Product } from '../classes/product';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  private baseUrl:string = "http://198.199.69.76:3000/planes";
  private plansUrl:string = "http://198.199.69.76:3000/detallePlanes";
  private transactionPlans = {
    "transaccion": "consultarPlanes"
  }

  constructor(private httpClient : HttpClient) { }

  public registerPlan(token, plan, cardToken){
    let transaction = 
    {
      "transaccion": "registrarPlan",
      "datosplanes": {
          "plan": plan,
          "renovacion": cardToken
      }
    }
      console.log(JSON.stringify(transaction));
    return this.httpClient.post(this.baseUrl,transaction, {
      headers: new HttpHeaders({
           'Content-Type':  'application/json',
           'x-token': token
         })
    }).map(data=>
     data);
  }

  public getPlans(){
    
    return this.httpClient.post(this.plansUrl,this.transactionPlans, {
      headers: new HttpHeaders({
           'Content-Type':  'application/json'
         })
    })
    .map(data => data);
  }
}
