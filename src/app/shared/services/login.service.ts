import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map'

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  baseUrl:string = "http://198.199.69.76:3000/usuarios";

  constructor(private httpClient : HttpClient) { }

  public login(obj){
    let transaction = 
      {
        "transaccion": "autenticarUsuario",
        "datosUsuario": obj
      }
    return this.httpClient.post(this.baseUrl,transaction, {
      headers: new HttpHeaders({
           'Content-Type':  'application/json',
         })
    }).map(data=>
     data);
  }

  public registerUser(obj){
    let transaction = 
      {
        "transaccion": "registrarUsuario",
        "datosUsuario": obj
      }
    return this.httpClient.post(this.baseUrl,transaction, {
      headers: new HttpHeaders({
           'Content-Type':  'application/json',
         })
    }).map(data=>
     data);
  }

  public validateOtp(obj){
    let transaction = 
      {
        "transaccion": "verificarCodigoOtp",
        "datosUsuario": obj
      }
    return this.httpClient.post(this.baseUrl,transaction, {
      headers: new HttpHeaders({
           'Content-Type':  'application/json',
         })
    }).map(data=>
     data);
  }

}
