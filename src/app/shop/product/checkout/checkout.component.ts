import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PayPalConfig, PayPalEnvironment, PayPalIntegrationType } from 'ngx-paypal';
// import {  IPayPalConfig,  ICreateOrderRequest } from 'ngx-paypal';
import { CartItem } from '../../../shared/classes/cart-item';
import { ProductsService } from '../../../shared/services/products.service';
import { CartService } from '../../../shared/services/cart.service';
import { OrderService } from '../../../shared/services/order.service';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

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
  public hoursFiltered : any[];
  public hoursFilteredDelivery : any[];
  public hourpickup : any;
  public hourdelivery : any;
  public country: any;
  public town: any;
  public state: any;
  public idType:any;
  public maxLengthId: any;
  public validationRegEx: any;
  public currentHour : any;
  public mensajeHora: any = "Ya es muy tarde para realizar un pedido para recogerlo el día de hoy.";

  public payment: any;
  public totalPayment: any;

  public addresses: any;
  
  public hours = [
    {
      value: 7,
      text: '07h00 - 08h00'
    },
    {
      value: 8,
      text: '08h00 - 09h00'
    },
    {
      value: 9,
      text: '09h00 - 10h00'
    },
    {
      value: 10,
      text: '10h00 - 11h00'
    },
    {
      value: 11,
      text: '11h00 - 12h00'
    },
    {
      value: 12,
      text: '12h00 - 13h00'
    },
    {
      value: 13,
      text: '13h00 - 14h00'
    },
    {
      value: 14,
      text: '14h00 - 15h00'
    },
    {
      value: 15,
      text: '15h00 - 16h00'
    },
    {
      value: 16,
      text: '16h00 - 17h00'
    },
    {
      value: 17,
      text: '17h00 - 18h00'
    }
  ]


  // Form Validator
  constructor(private fb: FormBuilder, private cartService: CartService, 
    public productsService: ProductsService, private orderService: OrderService, private router: Router, private toastrService: ToastrService) {
    this.checkoutForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
      lastname: ['', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
      idType: ['', Validators.required],
      idNumber: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('[0-9]+')]],
      email: ['', [Validators.required, Validators.email]],
      address: ['null', Validators.required],
      address2: ['null', Validators.required],
      country: ['', Validators.required],
      town: ['', Validators.required],
      state: ['', Validators.required],
      postalcode: ['', Validators.required],
      datepickup: [''],
      datedelivery: [''],
      hourpickup: [''],
      hourdelivery: ['']
    });
    this.addresses = localStorage.getItem("addresses")?JSON.parse(localStorage.getItem("addresses")):'';    
  }

  ngOnInit() {
    this.cartItems = this.cartService.getItems();
    this.cartItems.subscribe(products => this.checkOutItems = products);
    this.getTotal().subscribe(amount => this.amount = amount);
    this.initConfig();
    this.currentHour = new Date().getHours();
    this.datepickup = (this.currentHour>=13) ? this.currentDate(1): this.currentDate(0);
    this.updateDates();
    this.hourpickup=this.hoursFiltered[0].value;
    this.calculateHour();
    this.hourdelivery=this.hoursFilteredDelivery[0].value;
    this.country='Ecuador';
    this.town='Quito';
    this.state='Pichincha';
    this.idType='05';
    this.maxLengthId='10';
    this.validationRegEx=/[^0-9]/g;
    //console.log(this.hourpickup);
  }
  
  public pay(){
    //alert("Gracias por contratar nuestros servicios! Un asesor de ROLIM se contactará con usted.");
    //this.cartService.cleanCart();
    //this.router.navigate(['index']);
    if(this.checkoutForm.value.address=="null" || this.checkoutForm.value.address2=="null"){
      alert("Debe seleccionar una dirección");
    }else{
      
      let detallePedido = [];
      for(var i=0; i<this.checkOutItems.length;i++){
        detallePedido.push(
          {
            "id": this.checkOutItems[i].product.id, 
            "precio": this.checkOutItems[i].product.price.toString(),  
            "cantidadPedido": this.checkOutItems[i].quantity,
            "totalPorArticulo": "$"+this.checkOutItems[i].product.price,
          }
        )
      }

      this.getTotal().subscribe((total: number)=>{this.totalPayment = total});

      let orderJson = {
        "direccionRecogida": parseInt(this.checkoutForm.value.address),
        "direccionEntrega": parseInt(this.checkoutForm.value.address2),
        "fechaRecoger": this.datepickup.replace(/-/g,'/'),
        "horaRecoger": this.hourpickup+":00",
        "fechaEntrega": this.datedelivery.replace(/-/g,'/'),
        "horaEntrega": this.hourdelivery+":00",
        "comentarioPedido": null,
        "valorDescuento": null,
        "totalPedido": this.totalPayment,
        "idCupon": null,
        "metodoPago": (this.payment)? "EFECTIVO":"TARJETA",
        "detallePedido": detallePedido
      }
      console.log(orderJson);
      console.log(this.checkOutItems);
      this.orderService.saveOrder(localStorage.getItem("token"), orderJson).subscribe((response)=>{
        console.log(response);
        if(response['codigoRetorno']=="0001"){
          console.log("orden creada: " + response['idPedido']);
          this.orderService.createOrder(this.checkOutItems, this.checkoutForm.value, parseInt(response['idPedido']), this.totalPayment);
        }else{
          this.toastrService.error('El pedido no se pudo generar: '+response['mensajeRetorno']);
        }
       });
      //this.orderService.createOrder(this.checkOutItems, this.checkoutForm.value, Math.floor((Math.random() * 1000) + 1), this.amount+1.5);
    }
    
  }

  public calculateHour(){
    if(this.datepickup == this.currentDate(0)){
      this.hoursFiltered = this.hours.filter(hour=>hour.value>this.currentHour+4);
    }
    else{
      this.hoursFiltered = this.hours;
    }
    this.updateHourDelivery();
    
  }

  public updateHourDelivery(){
    this.hoursFilteredDelivery = this.hours.filter(hour=>hour.value>=this.hourpickup);
  }

  public updateIdValidation(){
    if(this.idType=='05'){
      this.maxLengthId='10';
      this.checkoutForm.controls.idNumber.setValidators([Validators.required, Validators.pattern('[0-9]+'), Validators.minLength(this.maxLengthId)]);
    }else if(this.idType=='04'){
      this.maxLengthId='13';
      this.checkoutForm.controls.idNumber.setValidators([Validators.required, Validators.pattern('[0-9]+'), Validators.minLength(this.maxLengthId)]);
    }else{
      this.maxLengthId='50';
      this.checkoutForm.controls.idNumber.setValidators([Validators.required, Validators.maxLength(this.maxLengthId)]);
    }
    
    this.checkoutForm.controls.idNumber.updateValueAndValidity();
    console.log("updateIdValidation"+this.maxLengthId);
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
    this.calculateHour();
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
