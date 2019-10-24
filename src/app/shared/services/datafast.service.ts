import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map'

@Injectable({
  providedIn: 'root'
})
export class DatafastService {

  private userId: any = '8a829418533cf31d01533d06fd040748';
  private entityId: any = '8a829418533cf31d01533d06f2ee06fa';
  private password: any = 'Xt7F22QENX';

  constructor(private httpClient : HttpClient) { }

  public getCheckoutId(amount){
    let url = "https://test.oppwa.com/v1/checkouts";
    let data = "authentication.entityId="+this.entityId
    + "&authentication.userId="+this.userId
    + "&authentication.password="+this.password
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

  public processPurchase(resourcePath){
    let url = "https://test.oppwa.com/v1/checkouts/"+resourcePath+"/payment";
    url += "?authentication.userId="+this.userId;
    url += "&authentication.password="+this.password;
    url += "&authentication.entityId="+this.entityId;
    console.log(url);
    return this.httpClient.get(url).map(data=>
     data);
  }
}
