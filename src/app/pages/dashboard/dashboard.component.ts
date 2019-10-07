import { Component, OnInit } from '@angular/core';
import { CartService } from '../../shared/services/cart.service';
import { AddressService } from './../../shared/services/address.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public user: any;
  public addresses: any;

  constructor(private cartService: CartService, private addressService: AddressService) { 
    this.user = localStorage.getItem("user")?JSON.parse(localStorage.getItem("user")):'';
    this.addresses = localStorage.getItem("addresses")?JSON.parse(localStorage.getItem("addresses")):'';
  }

  ngOnInit() {
    this.getAddresses();
    console.log(this.addresses);
  }

  private getAddresses(){
    this.addressService.getAddresses(localStorage.getItem("token")).subscribe((response)=>{
      //console.log(response);
      if(response['codigoRetorno']=="0001"){
        localStorage.setItem("addresses", JSON.stringify(response['data']));
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

}
