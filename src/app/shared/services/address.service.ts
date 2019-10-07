import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map'

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  private baseUrl:string = "http://198.199.69.76:3000/direcciones";

  constructor(private httpClient : HttpClient) { }

  public saveAddress(obj, token){
    let transaction = 
      {
        "transaccion": "registrarDirecciones",
        "datosDireccion": obj
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

  public getAddresses(token){
    let transaction = 
      {
        "transaccion": "consultarDirecciones"
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