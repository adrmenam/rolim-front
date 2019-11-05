import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
//import 'rxjs/add/operator/map'
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DatafastService {

  
  //data de pruebas fase 1
  /*private userId: any = '8a829418533cf31d01533d06fd040748';
  private entityId: any = '8a829418533cf31d01533d06f2ee06fa';
  private password: any = 'Xt7F22QENX';
  */
  //data de comercio rolim
  private userId: any = '8a8294185a65bf5e015a6c8c728c0d95';
  private entityId: any = '8ac7a4c86e1b58ef016e1e33f5750709'
  private password: any = 'bfqGqwQ32X';
  private mid: any = '1000000505';
  private tid: any = 'PD100406';

  constructor(private httpClient : HttpClient) { }

  public getCheckoutId(amount,firstName,secondName,lastName,ip_address,trx,email,id,items){

    
    secondName="Alexander";
    

    let valIva12 = amount * 0.12;
    let valBaseIva12 = amount - valIva12;

    let iva12 = "004012" + valIva12.toFixed(2).toString().replace('.','').padStart(12,'0');
    let iva0 = "052012000000000000"; //siempre en 0
    let baseIva12 = "004012" + valBaseIva12.toFixed(2).toString().replace('.','').padStart(12,'0');
    let idComercio = "003007"+"0103910";  //Preguntar identificador de 7 digitos
    let idProveedorServicio = "051008"+"17913101"; //Preguntar identificador del proveedor de 8 digitos
    
    let customParameters = iva12+iva0+idComercio+idProveedorServicio+baseIva12;
    customParameters += customParameters.length.toString().padStart(4,'0')+customParameters;

    let userid = JSON.parse(localStorage.getItem("addresses"))[0].usuario_id;
    //let orderid = sessionStorage.getItem('orderId');

    let url = "https://test.oppwa.com/v1/checkouts";
    let data = "authentication.entityId="+this.entityId
    + "&authentication.userId="+this.userId
    + "&authentication.password="+this.password
    + "&amount="+amount.toFixed(2)
    + "&currency=USD"
    + "&paymentType=DB"

//parametros para fase 2 de prueba final
    
    + "&customer.givenName="+firstName
    //+ "&customer.middleName="+secondName
    + "&customer.surname="+lastName
    + "&customer.ip="+ip_address
    + "&customer.merchantCustomerId="+userid
    + "&merchantTransactionId=transaction_"+trx
    + "&customer.email="+email
    + "&customer.identificationDocType=IDCARD"
    + "&customer.identificationDocId="+id;

    console.log(items);
    for(var i=0; i<items.length;i++){
      data += "&cart.items["+i+"].name="+items[i].nombre;
      data += "&cart.items["+i+"].description="+items[i].nombre;
      //data += "&cart.items["+i+"].name=Camisa";
      //data += "&cart.items["+i+"].description=Camisa";
      data += "&cart.items["+i+"].price="+items[i].precio;
      data += "&cart.items["+i+"].quantity="+items[i].cantidad;
    }

    data += "&testMode=EXTERNAL";

    data += "&customParameters["+this.mid+"_"+this.tid+"]="+customParameters ;
    data += "&risk.parameters[USER_DATA2]=ROLIM";

    console.log(data);
    return this.httpClient.post(url,data, {
      headers: new HttpHeaders({
           'Content-Type':  'application/x-www-form-urlencoded',
         })
    }).pipe(map(data=>
     data));

  }

  public processPurchase(resourcePath){
    let url = "https://test.oppwa.com/"+resourcePath;
    url += "?authentication.userId="+this.userId;
    url += "&authentication.password="+this.password;
    url += "&authentication.entityId="+this.entityId;
    console.log(url);
    return this.httpClient.get(url).pipe(map(data=>
     data));
  }
}
