import { Injectable } from '@angular/core';
import { Product } from '../classes/product';
import { CartItem } from '../classes/cart-item';
import { Order } from '../classes/order';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map'

@Injectable({
  providedIn: 'root'
})

export class OrderService {
  
  private baseUrl:string = "http://198.199.69.76:3000/pedidos";

  // Array
  public OrderDetails;

  constructor(private router: Router, private httpClient : HttpClient) { }

  // Get order items
  public getOrderItems() : Order {
    return this.OrderDetails;
  }

  // Create order
  public createOrder(product: any, details: any, orderId: any, amount: any) {
    var item = {
        shippingDetails: details,
        product: product,
        orderId: orderId,
        totalAmount: amount
    };
    this.OrderDetails = item;
    sessionStorage.setItem("orderId", orderId);
    this.router.navigate(['/home/checkout/success']);
  }

  public createOrderNoRedirect(product: any, details: any, orderId: any, amount: any) {
    var item = {
        shippingDetails: details,
        product: product,
        orderId: orderId,
        totalAmount: amount
    };
    this.OrderDetails = item;
    sessionStorage.setItem("orderId", orderId);
    //this.router.navigate(['/home/checkout/success']);
  }

  public saveOrder(token, order){
    let transaction = 
      {
        "transaccion": "guardarPedido",
        "datosPedido": order
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

}
