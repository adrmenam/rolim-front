import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map'

@Injectable({
  providedIn: 'root'
})
export class DatafastService {

  constructor(private httpClient : HttpClient) { }

  public getCheckoutId(amount){
    let url = "https://test.oppwa.com/v1/checkouts";
    let data = ""
    + "authentication.entityId=8a829418533cf31d01533d06f2ee06fa"
    + "&authentication.userId=8a829418533cf31d01533d06fd040748"
    + "&authentication.password=Xt7F22QENX"
    + "&amount="+amount.toFixed(2)
    + "&currency=USD"
    + "&paymentType=DB";
    console.log(data);
    return this.httpClient.post(url,data, {
      headers: new HttpHeaders({
           'Content-Type':  'application/x-www-form-urlencoded',
         })
    }).map(data=>
     data);
  }
}
