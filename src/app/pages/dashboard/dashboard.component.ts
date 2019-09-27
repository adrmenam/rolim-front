import { Component, OnInit } from '@angular/core';
import { CartService } from '../../shared/services/cart.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public user: any;

  constructor(private cartService: CartService) { 
    this.user = localStorage.getItem("user")?JSON.parse(localStorage.getItem("user")):'';
  }

  ngOnInit() {
  }

  logout(){
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    this.cartService.cleanCart();
    window.location.reload();
  }

}
