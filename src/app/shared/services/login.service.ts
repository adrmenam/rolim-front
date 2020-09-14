import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map'
import * as sha1 from 'js-sha1';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private baseUrl:string = "https://rolimapp.com:3000/usuarios";

  constructor(private httpClient : HttpClient) { }

  public login(obj){
    obj.password = sha1(obj.password); //security, send hashed password
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
