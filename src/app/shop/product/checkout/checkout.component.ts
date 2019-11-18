import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PayPalConfig, PayPalEnvironment, PayPalIntegrationType } from 'ngx-paypal';
// import {  IPayPalConfig,  ICreateOrderRequest } from 'ngx-paypal';
import { CartItem } from '../../../shared/classes/cart-item';
import { ProductsService } from '../../../shared/services/products.service';
import { CartService } from '../../../shared/services/cart.service';
import { OrderService } from '../../../shared/services/order.service';
import { DatafastService } from '../../../shared/services/datafast.service';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpClient,HttpHeaders } from '@angular/common/http';

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

  public datafast: any;
  public payment: any;
  public subtotalPayment: any;
  public totalPayment: any;
  public deliveryPrice: any;
  public minFreeDelivery: any;
  public minOrder: any;

  public firstname: any;
  public lastname: any;
  public phone: any;
  public email: any;
  private publicIp: any;

  public addresses: any;
  public idOrden: any;

  public widgetUrl: any = "https://test.oppwa.com/v1/paymentWidgets.js?checkoutId=";
  public scriptSaveDatafast: any;
  public scriptSaveDatafastNormal: any;
  public loadAPI: Promise<any>;
  public loadScriptDatafastForm: Promise<any>;

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
  constructor(private http : HttpClient, private fb: FormBuilder, private cartService: CartService, 
    public productsService: ProductsService, private orderService: OrderService, private router: Router, private toastrService: ToastrService, private datafastService: DatafastService) {
      this.addresses = localStorage.getItem("addresses")?JSON.parse(localStorage.getItem("addresses")):'';    
      this.deliveryPrice = sessionStorage.getItem("valor delivery")?parseFloat(sessionStorage.getItem("valor delivery")):1.5;
      this.minOrder = sessionStorage.getItem("pedido minimo")?parseFloat(sessionStorage.getItem("pedido minimo")):0;
      this.minFreeDelivery = sessionStorage.getItem("domicilio minimo")?parseFloat(sessionStorage.getItem("domicilio minimo")):0;
      this.firstname = localStorage.getItem("user")?JSON.parse(localStorage.getItem("user"))["nombre"].toString().split(" ")[0]:'';
      this.lastname = localStorage.getItem("user")?JSON.parse(localStorage.getItem("user"))["nombre"].toString().split(" ")[1]:'';
      this.phone = localStorage.getItem("user")?JSON.parse(localStorage.getItem("user"))["telefono"]:'';
      this.email = localStorage.getItem("user")?JSON.parse(localStorage.getItem("user"))["email"]:'';
    

      this.checkoutForm = this.fb.group({
        firstname: [this.firstname, [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
        lastname: [this.lastname, [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
        idType: ['', Validators.required],
        idNumber: ['', Validators.required],
        phone: [this.phone, Validators.required],
        email: [this.email, [Validators.required, Validators.email]],
        address: ['null', Validators.required],
        address2: ['null', Validators.required],
        country: ['', Validators.required],
        town: ['', Validators.required],
        state: ['', Validators.required],
        postalcode: [''],
        datepickup: [''],
        datedelivery: [''],
        hourpickup: [''],
        hourdelivery: ['']
      });

      this.scriptSaveDatafast = "var wpwlOptions = {"
        +"onReady: function(onReady){"
        +"var createRegistrationHtml = '<div class=\"customLabel\" hidden>Desea guardar de manera segura sus datos?</div>'+"
        +"'<div class=\"customInput\" hidden><input type=\"checkbox\" name=\"createRegistration\" Checked /></div>';"
        +"$('form.wpwl-form-card').find('.wpwl-button').before(createRegistrationHtml);"
        +"},"
        +"style: \"card\","
        +"locale: \"es\","
        +"labels: {cvv:\"Código de verificación\", cardHolder: \"Nombre(Igual que en la tarjeta)\"},"
        +"registrations:{"
        +"requireCvv:true,"
        +"hideInitialPaymentForms:true"
        +"}"
        +"}";
      
      this.scriptSaveDatafastNormal = "var wpwlOptions = {"
        +"onReady: function(onReady){"
        +"var createRegistrationHtml = '<div class=\"customLabel\" >Desea guardar de manera segura sus datos?</div>'+"
        +"'<div class=\"customInput\" ><input type=\"checkbox\" name=\"createRegistration\" /></div>';"
        +"$('form.wpwl-form-card').find('.wpwl-button').before(createRegistrationHtml);"
        +"},"
        +"style: \"card\","
        +"locale: \"es\","
        +"labels: {cvv:\"Código de verificación\", cardHolder: \"Nombre(Igual que en la tarjeta)\"},"
        +"registrations:{"
        +"requireCvv:true,"
        +"hideInitialPaymentForms:true"
        +"}"
        +"}";
    
  }

  ngOnInit() {
    this.cartItems = this.cartService.getItems();
    this.cartItems.subscribe(products => this.checkOutItems = products);
    this.getTotal().subscribe(amount => this.amount = amount);
    
    this.datafast = false;

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
    this.payment=true;
    this.cartService.getTotalAmount().subscribe((total: number)=>{this.subtotalPayment = total});
    this.getTotal().subscribe((total: number)=>{this.totalPayment = total});
    //Info toast if minimum order total not reached
    if(this.subtotalPayment<this.minOrder){
      this.toastrService.info('El pedido mínimo es de '+this.minOrder+' dólares, agrega más elementos a tu pedido, de lo contrario se cobrará el mínimo');  
    }

    

    //Datafast step 1: get CheckoutId 
    
    //Load datafast api
    

    //Force user to login for accessing checkout page
    if(this.firstname==''){
      this.toastrService.info('Para pagar, primero debes iniciar sesión o registrarte.');
      this.router.navigate(['pages/login']);
    }

   
    
  }

  public goToDashboard(){
    console.log("goToDashboard");
    sessionStorage.setItem("fromCheckout",'true');
    this.router.navigate(['/pages/dashboard']);
  }

  public showPayment(){

    if(this.checkoutForm.value.address=="null" || this.checkoutForm.value.address2=="null"){
      alert("Debe seleccionar una dirección");
    }else{
      this.datafast = true;
      let detallePedido = [];
      let productosDatafast = [];
      let priceSum = 0;
      let checkoutType = 'normal';
      for(var i=0; i<this.checkOutItems.length;i++){
        detallePedido.push(
          {
            "id": this.checkOutItems[i].product.id, 
            "precio": this.checkOutItems[i].product.price.toString(),  
            "cantidadPedido": this.checkOutItems[i].quantity,
            "totalPorArticulo": "$"+this.checkOutItems[i].product.price,
          }
        );
        productosDatafast.push(
          {
            "id": this.checkOutItems[i].product.id, 
            "precio": this.checkOutItems[i].product.price.toString(),
            "nombre": this.checkOutItems[i].product.name,  
            "cantidad": this.checkOutItems[i].quantity
            
          }
        );
        priceSum+=this.checkOutItems[i].product.price;

        if(this.checkOutItems[i].product.category=="plan"){
          checkoutType="firstRecurrent";
          sessionStorage.setItem("planId",this.checkOutItems[i].product.id.toString());
        }
      }

      this.getTotal().subscribe((total: number)=>{this.totalPayment = total});

console.log(priceSum+this.deliveryPrice == this.totalPayment);
      if(priceSum+this.deliveryPrice == this.totalPayment){
        detallePedido.push({
          "id": 0, 
          "precio": this.deliveryPrice.toString(),  
          "cantidadPedido": 1,
          "totalPorArticulo": "$"+this.deliveryPrice
        });
      }

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
          this.idOrden = response['idPedido'];
          this.orderService.createOrderNoRedirect(this.checkOutItems, this.checkoutForm.value, parseInt(response['idPedido']), this.totalPayment);
          this.http.get('https://api.ipify.org?format=json').subscribe(data=>{
            this.publicIp=data['ip'];
            console.log(this.publicIp);
            console.log("recurrente: "+checkoutType);
            this.getCheckoutId(this.totalPayment, this.checkoutForm.value.firstname,this.checkoutForm.value.firstname,
                this.checkoutForm.value.lastname,this.publicIp,this.idOrden,this.checkoutForm.value.email,this.checkoutForm.value.idNumber,productosDatafast,checkoutType);
          });
          this.cartService.cleanCart();
        }else{
          this.toastrService.error('El pedido no se pudo generar: '+response['mensajeRetorno']);
        }
       });
      //this.orderService.createOrder(this.checkOutItems, this.checkoutForm.value, Math.floor((Math.random() * 1000) + 1), this.amount+1.5);
    }

    
  }

  public getCheckoutId(amount,firstName,secondName,lastName,ip_address,trx,email,id,items,type){
    //Datafast step 1: get CheckoutId 
    this.datafastService.getCheckoutId(amount,firstName,secondName,lastName,ip_address,trx,email,id,items,type).subscribe((response)=>{
      console.log(response);
      let scriptSave;
      if(response['result']['description']=="successfully created checkout"){
        console.log("CheckoutId: " + response['id']);
        this.widgetUrl+=response['id'];
        console.log(this.widgetUrl);
        if(type=="firstRecurrent"){
          scriptSave=this.scriptSaveDatafast;
        }else{
          scriptSave=this.scriptSaveDatafastNormal;
        }
        this.loadScriptDatafastForm = new Promise((resolve) => {
          console.log('resolving promise...');
          this.loadScriptContent(scriptSave);
        });
        this.loadAPI = new Promise((resolve) => {
          console.log('resolving promise...');
          this.loadScript(this.widgetUrl);
        });
      }else{
        this.toastrService.error('No se pudo comunicar con el botón de pago.');
      }
     });
  }
  

  public pay(){
    //alert("Gracias por contratar nuestros servicios! Un asesor de ROLIM se contactará con usted.");
    //this.cartService.cleanCart();
    //this.router.navigate(['index']);
    if(this.checkoutForm.value.address=="null" || this.checkoutForm.value.address2=="null"){
      alert("Debe seleccionar una dirección");
    }else{
      
      let detallePedido = [];
      let priceSum = 0;
      for(var i=0; i<this.checkOutItems.length;i++){
        detallePedido.push(
          {
            "id": this.checkOutItems[i].product.id, 
            "precio": this.checkOutItems[i].product.price.toString(),  
            "cantidadPedido": this.checkOutItems[i].quantity,
            "totalPorArticulo": "$"+this.checkOutItems[i].product.price,
          }
        )
        priceSum+=this.checkOutItems[i].product.price;

      }

      this.getTotal().subscribe((total: number)=>{this.totalPayment = total});

console.log(priceSum+this.deliveryPrice == this.totalPayment);
      if(priceSum+this.deliveryPrice == this.totalPayment){
        detallePedido.push({
          "id": 0, 
          "precio": this.deliveryPrice.toString(),  
          "cantidadPedido": 1,
          "totalPorArticulo": "$"+this.deliveryPrice
        });
      }

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
          this.cartService.cleanCart();
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

  // Get  Total
  public getTotal(): Observable<number> {
    
    //In case order total is lower than minimum order total
    if(this.subtotalPayment<this.minOrder){
        return (this.ship=='T')?this.cartService.getMinOrderTotalWithShipping():this.cartService.getMinOrderTotal();
    }

    //If is a normal order superior to minimum order total asks for conditions to add shipping
    if(this.ship=='T' && this.subtotalPayment<this.minFreeDelivery)
      return this.cartService.getTotalWithShipping();
    else
      return this.cartService.getTotalAmount();
  }

  public getSubTotal(): Observable<number> {
    return this.cartService.getTotalAmount();
  }

  public getShippingCost(): Observable<number> {
    if(this.subtotalPayment<this.minFreeDelivery){
      return this.cartService.getShippingCost();
    }else{
      return this.cartService.getShippingCostNull();
    }
    
  }



  //Add Script tag to head for Datafast integration
  public loadScript(url) {
    console.log('preparing to load...')
    let node = document.createElement('script');
    node.src = url;
      
    document.getElementsByTagName('body')[0].appendChild(node); 
    
  }

  //Add Script tag to head for Datafast integration
  public loadScriptContent(content) {
    console.log('preparing to load...')
    let node = document.createElement('script');
    node.type = 'text/javascript';
    node.innerHTML = content;
    console.log(node);
      
    document.getElementsByTagName('body')[0].appendChild(node); 
    
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
