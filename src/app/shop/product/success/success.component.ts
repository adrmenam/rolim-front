import { Component, OnInit } from '@angular/core';
import { Order } from '../../../shared/classes/order';
import { OrderService } from '../../../shared/services/order.service';
import { CartService } from '../../../shared/services/cart.service';
import { BillingService } from '../../../shared/services/billing.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DatafastService } from '../../../shared/services/datafast.service';
import { SubscriptionService } from '../../../shared/services/subscription.service';
import { PaymentService } from '../../../shared/services/payment.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-order-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss']
})
export class SuccessComponent implements OnInit {
  
  private api_key: String = "API_974_1085_5d726d755d51e";
  private codigo_doc: String = "01";
  public orderDetails : Order = {};
  public total: number;
  private billingItems: any = [];
  public orderid: any;
  public planid: any;
  
  private resourcePath: any;

  constructor(private toastrService: ToastrService, private route: ActivatedRoute, 
    private orderService: OrderService, private subscriptionService: SubscriptionService, 
    private cartService: CartService, private billingService: BillingService, 
    private router: Router, private datafastService: DatafastService, 
    private paymentService: PaymentService) { }

  ngOnInit() {
    
    //this.sendBilling();
    this.planid=sessionStorage.getItem("planId")?sessionStorage.getItem("planId"):'noPlan';
    sessionStorage.removeItem("fromCheckout");

    this.route.queryParams.subscribe(params => {
      let resourcePath = params['resourcePath'];
      console.log(resourcePath); // Print the parameter to the console. 
      if(resourcePath){
        this.processPurchase(resourcePath);
        //this.orderDetails = this.orderService.getOrderItems();
        
        this.orderid=sessionStorage.getItem("orderId")?sessionStorage.getItem("orderId"):'';
        
      }else{
        this.orderDetails = this.orderService.getOrderItems();
        //this.total = this.orderDetails.totalAmount;
        this.orderid= this.orderDetails.orderId;
      }
      
    });
    console.log(this.orderDetails);
    console.log(this.orderid);
  }

  public processPurchase(resourcePath){
    //Datafast step 2: Purchase process 
    this.datafastService.processPurchase(resourcePath).subscribe((response)=>{
      console.log(response);
      if(response['result']['code']=="000.100.110"){
        console.log("Respuesta: " + response['result']['description']);
        let cardToken = response['registrationId'];
        
        if(this.planid!="noPlan"){
          console.log("Registro del plan "+this.planid+" con el cardToken "+cardToken)
          this.subscriptionService.registerPlan(localStorage.getItem("token"),this.planid,cardToken).subscribe((response=>{
            console.log(response);
          }));
        }else{
          console.log("Registro del cardToken sin plan: "+cardToken)
          this.paymentService.registerCardToken(localStorage.getItem("token"),cardToken).subscribe((response=>{
            console.log(response);
          }));
        }
        
      }else{
        console.log('La transacción con el botón de pagos no pudo completarse.');
        this.toastrService.error("La transacción con el botón de pagos no pudo completarse.");
        
      }
     });
  }

  public returnHome(){
    this.cartService.cleanCart();
    sessionStorage.removeItem("orderId");
    sessionStorage.removeItem("planId");
    this.router.navigate(['']);
  }

  public sendBilling(){

    let sumPrice: number = 0;
    console.log(this.orderDetails);
    this.orderDetails.product.forEach(element => {
      this.billingItems.push({
        "codigo_principal": element.product.id.toString(),
        "descripcion": element.product.name,
        "tipoproducto": 2,
        "tipo_iva": 2,
        "precio_unitario": element.product.price,
        "cantidad": element.quantity
      });
      sumPrice+=element.product.price;
    });

    // for(var i=0;i<=this.orderDetails.product.length;i++)

    if(this.orderDetails.totalAmount == sumPrice+1.5){
      this.billingItems.push({
        "codigo_principal": "00",
        "descripcion": "Envío",
        "tipoproducto": 2,
        "tipo_iva": 2,
        "precio_unitario": 1.50,
        "cantidad": 1
      });
    }
    let currDate = new Date();
    let billingDate = currDate.toISOString().substring(0,10);

    let bill = {
      "api_key": this.api_key,
      "codigoDoc": this.codigo_doc,
      "emisor": {
        "manejo_interno_secuencia": "NO",
        "secuencial": "000000001",
        "fecha_emision": billingDate.replace(/-/g,'/')
      },
      "comprador": {
        "tipo_identificacion": this.orderDetails.shippingDetails.idType,
        "identificacion": this.orderDetails.shippingDetails.idNumber,
        "razon_social": this.orderDetails.shippingDetails.firstname+ " " +this.orderDetails.shippingDetails.lastname,
        "direccion": this.orderDetails.shippingDetails.address,
        "telefono": this.orderDetails.shippingDetails.phone,
        "correo": this.orderDetails.shippingDetails.email
      },
      "items": this.billingItems
    }

    console.log(JSON.stringify(bill));

    let billReturn = this.billingService.sendBill(bill).subscribe((response)=>{
      console.log(response);
     });
  

    

    
    // let bill = {
    //   "api_key": this.api_key,
    //   "codigoDoc": this.codigo_doc,
    //   "emisor": {
    //     "manejo_interno_secuencia": "NO",
    //     "secuencial": "000000001",
    //     "fecha_emision": "2019/09/22"
    //   },
    //   "comprador": {
    //     "tipo_identificacion": "05",
    //     "identificacion": "1721492336",
    //     "razon_social": "Adrian Mena",
    //     "direccion": "Av Amazonas",
    //     "telefono": "2 462587",
    //     "celular": null,
    //     "correo": "adrianmenamanciati@gmail.com"
    //   },
    //   "items": [{
    //     "codigo_principal": "1",
    //     "descripcion": "Plan Estudiantil",
    //     "tipoproducto": 2,
    //     "tipo_iva": 2,
    //     "precio_unitario": 21.00,
    //     "cantidad": 1
    //   }]
    // }
  }

}
