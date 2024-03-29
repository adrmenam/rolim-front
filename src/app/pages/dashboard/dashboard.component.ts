import { Component, OnInit } from '@angular/core';
import { CartService } from '../../shared/services/cart.service';
import { AddressService } from './../../shared/services/address.service';
import { ToastrService } from 'ngx-toastr';
import { Router, RoutesRecognized } from '@angular/router';
import { filter, pairwise } from 'rxjs/operators';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public user: any;
  public addresses: any;
  public showReturn: boolean = false;
  public fromCheckout: any;

  constructor(private cartService: CartService, private addressService: AddressService, private toastrService: ToastrService, public router: Router) { 
    this.user = localStorage.getItem("user")?JSON.parse(localStorage.getItem("user")):'';
    this.addresses = localStorage.getItem("addresses")?JSON.parse(localStorage.getItem("addresses")):'';
    this.fromCheckout = sessionStorage.getItem("fromCheckout")?sessionStorage.getItem("fromCheckout"):'false';
    // this.router.events
    //         .pipe(filter((e: any) => e instanceof RoutesRecognized),
    //             pairwise()
    //         ).subscribe((e: any) => {
    //             console.log("url previa: "+e[0].urlAfterRedirects); // previous url
    //             this.previousUrl=e[0].urlAfterRedirects;
    //             if(e[0].urlAfterRedirects=='/home/checkout'){
                  
    //               this.showReturn=true;
    //               console.log("Muestra Boton Regresar: "+this.showReturn);
    //             }
    //         });
    this.getAddresses();
    console.log(this.addresses);
  }

  ngOnInit() {
  }

  private getAddresses(){
    this.addressService.getAddresses(localStorage.getItem("token")).subscribe((response)=>{
      //console.log(response);
      if(response['codigoRetorno']=="0001"){
        localStorage.setItem("addresses", JSON.stringify(response['data']));
      }
     });
  }

  private deleteAddress(id){
    console.log("delete: "+id);
    this.addressService.deleteAddress(parseInt(id),localStorage.getItem("token")).subscribe((response)=>{
      console.log(response);
      if(response['codigoRetorno']=="0001"){
        
        this.toastrService.success('Dirección eliminada');
        let addressList = JSON.parse(localStorage.getItem("addresses"));
        this.addresses=addressList.filter(address => address.id != id);
        
        localStorage.setItem("addresses", JSON.stringify(this.addresses));
      }
     });
  }

  logout(){
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("addresses");
    this.cartService.cleanCart();
    window.location.reload();
  }

  goToPayment(){
    sessionStorage.removeItem("fromCheckout");
    this.router.navigate(['/home/checkout']);
  }

}
