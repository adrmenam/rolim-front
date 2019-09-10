import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PayPalConfig, PayPalEnvironment, PayPalIntegrationType } from 'ngx-paypal';
// import {  IPayPalConfig,  ICreateOrderRequest } from 'ngx-paypal';
import { CartItem } from '../../../shared/classes/cart-item';
import { ProductsService } from '../../../shared/services/products.service';
import { CartService } from '../../../shared/services/cart.service';
import { OrderService } from '../../../shared/services/order.service';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  
  // form group
  public checkoutForm   :  FormGroup;
  public cartItems      :  Observable<CartItem[]> = of([]);
  public checkOutItems  :  CartItem[] = [];
  public orderDetails   :  any[] = [];
  public amount         :  number;
  public payPalConfig ? : PayPalConfig;
  public ship : any = 'F';
  public privacy : boolean = false;
  public terms : boolean = false;
  public datepickup : any;
  public datedelivery : any;
  public datepickupMin : any;
  public datedeliveryMin : any;


  // Form Validator
  constructor(private fb: FormBuilder, private cartService: CartService, 
    public productsService: ProductsService, private orderService: OrderService) {
    this.checkoutForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
      lastname: ['', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
      phone: ['', [Validators.required, Validators.pattern('[0-9]+')]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required, Validators.maxLength(50)]],
      country: ['', Validators.required],
      town: ['', Validators.required],
      state: ['', Validators.required],
      postalcode: ['', Validators.required],
      datepickup: ['', Validators.required],
      datedelivery: ['', Validators.required],
      hourpickup: ['', Validators.required],
      hourdelivery: ['', Validators.required],
    })    
  }

  ngOnInit() {
    this.cartItems = this.cartService.getItems();
    this.cartItems.subscribe(products => this.checkOutItems = products);
    this.getTotal().subscribe(amount => this.amount = amount);
    this.initConfig();
    this.datepickup = this.currentDate(0);
    this.updateDates();
  }
  

  public currentDate(num) {
    let currentDate = new Date();
    currentDate.setDate(currentDate.getDate()+num);
    return currentDate.toISOString().substring(0,10);
  }

  public updateDates(){
    let dateDelivery = new Date(this.datepickup);
    dateDelivery.setDate(dateDelivery.getDate()+2);
    this.datedelivery = this.getDateString(dateDelivery);
    this.datepickupMin = this.currentDate(0);
    this.datedeliveryMin = this.datedelivery;
  }

  public currentDateMiliseconds(num) {
    let currentDate = new Date();
    currentDate.setDate(currentDate.getDate()+num);
    return currentDate.getMilliseconds();
  }

  public getDateString(date: Date){
    return date.toISOString().substring(0,10);
  }
  // Get sub Total
  public getTotal(): Observable<number> {
    if(this.ship=='T')
      return this.cartService.getTotalWithShipping();
    else
      return this.cartService.getTotalAmount();
  }

  public getSubTotal(): Observable<number> {
    return this.cartService.getTotalAmount();
  }

  public getShippingCost(): Observable<number> {
    return this.cartService.getShippingCost();
  }


 
  // stripe payment gateway
  stripeCheckout() {
      var handler = (<any>window).StripeCheckout.configure({
        key: 'PUBLISHBLE_KEY', // publishble key
        locale: 'auto',
        token: (token: any) => {
          // You can access the token ID with `token.id`.
          // Get the token ID to your server-side code for use.
          this.orderService.createOrder(this.checkOutItems, this.checkoutForm.value, token.id, this.amount);
        }
      });
      handler.open({
        name: 'Multikart',
        description: 'Online Fashion Store',
        amount: this.amount * 100
      }) 
  }

  // Paypal payment gateway
  private initConfig(): void {
      this.payPalConfig = new PayPalConfig(PayPalIntegrationType.ClientSideREST, PayPalEnvironment.Sandbox, {
        commit: true,
        client: {
          sandbox: 'CLIENT_ID', // client Id
        },
        button: {
          label: 'paypal',
          size:  'small',    // small | medium | large | responsive
          shape: 'rect',     // pill | rect
          //color: 'blue',   // gold | blue | silver | black
          //tagline: false  
        },
        onPaymentComplete: (data, actions) => {
          this.orderService.createOrder(this.checkOutItems, this.checkoutForm.value, data.orderID, this.amount);
        },
        onCancel: (data, actions) => {
          console.log('OnCancel');
        },
        onError: (err) => {
          console.log('OnError');
        },
        transactions: [{
          amount: {
            currency: this.productsService.currency,
            total: this.amount
          }
        }]
      });
  }

  
}
