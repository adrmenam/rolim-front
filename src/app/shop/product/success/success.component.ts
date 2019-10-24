import { Component, OnInit } from '@angular/core';
import { Order } from '../../../shared/classes/order';
import { OrderService } from '../../../shared/services/order.service';
import { CartService } from '../../../shared/services/cart.service';
import { BillingService } from '../../../shared/services/billing.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DatafastService } from '../../../shared/services/datafast.service';

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
  
  private resourcePath: any;

  constructor(private route: ActivatedRoute, private orderService: OrderService, private cartService: CartService, private billingService: BillingService, private router: Router, private datafastService: DatafastService) { }

  ngOnInit() {
    this.orderDetails = this.orderService.getOrderItems();
    this.total = this.orderDetails.totalAmount;
    //this.sendBilling();
    this.resourcePath = this.route.snapshot.paramMap.get("resourcePath");
    this.processPurchase(this.resourcePath);
  }

  public processPurchase(resourcePath){
    //Datafast step 2: Purchase process 
    this.datafastService.processPurchase(resourcePath).subscribe((response)=>{
      console.log(response);
      if(response['result']['code']=="000.100.110"){
        console.log("Respuesta: " + response['result']['description']);
        
      }else{
        console.log('No se pudo comunicar con el botón de pago.');
      }
     });
  }

  public returnHome(){
    this.cartService.cleanCart();
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
      // if(response['mensajeRetorno']=="Usuario Almacenado"){
      //   this.toastrService.success('El usuario se ha creado correctamente');  
      //   this.requireOtp=true;   
      // }else if(response['mensajeRetorno']=="usuario ya existe"){
      //   this.toastrService.error("El usuario ya existe");
      // }else{
      //   this.toastrService.error("El usuario no se pudo registrar");
      // }
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
