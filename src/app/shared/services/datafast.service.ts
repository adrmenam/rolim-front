import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map'

@Injectable({
  providedIn: 'root'
})
export class DatafastService {

  
  //data de pruebas fase 1
  //private userId: any = '8a829418533cf31d01533d06fd040748';
  //private entityId: any = '8a829418533cf31d01533d06f2ee06fa';
  //private password: any = 'Xt7F22QENX';

  //data de comercio
  private userId: any = '8a8294185a65bf5e015a6c8c728c0d95';
  private entityId: any = '8ac7a4c86e1b58ef016e1e33f5750709'
  private password: any = 'bfqGqwQ32X';
  private mid: any = '1000000505';
  private tid: any = 'PD100406';

  constructor(private httpClient : HttpClient) { }

  public getCheckoutId(amount,firstName,secondName,lastName,ip_address,trx,email,id,items){

    firstName="Adrian";
    secondName="Alexander";
    lastName="Mena";
    id="1721492336";

    let url = "https://test.oppwa.com/v1/checkouts";
    let data = "authentication.entityId="+this.entityId
    + "&authentication.userId="+this.userId
    + "&authentication.password="+this.password
    + "&amount="+amount.toFixed(2)
    + "&currency=USD"
    + "&paymentType=DB"

//parametros para fase 2 de prueba final
    
    + "&customer.givenName="+firstName
    + "&customer.middleName="+secondName
    + "&customer.surname="+lastName
    + "&customer.ip="+ip_address
    + "&customer.merchantCustomerId="+this.mid
    + "&merchantTransactionId=transaction_"+this.tid
    + "&customer.email="+email
    + "&customer.identificationDocType=IDCARD"
    + "&customer.identificationDocId="+id;


    for(var i=0; i<items.length;i++){
      //data += "&cart.items["+i+"].name="+items[i].product.name;
      //data += "&cart.items["+i+"].description="+items[i].product.name;
      data += "&cart.items["+i+"].name=Camisa";
      data += "&cart.items["+i+"].description=Camisa";
      data += "&cart.items["+i+"].price="+items[i].product.price.toString();
      data += "&cart.items["+i+"].quantity="+items[i].quantity;
    }

    data += "&testMode=EXTERNAL"

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
