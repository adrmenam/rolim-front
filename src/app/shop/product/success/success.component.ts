import { Component, OnInit } from '@angular/core';
import { Order } from '../../../shared/classes/order';
import { OrderService } from '../../../shared/services/order.service';
import { CartService } from '../../../shared/services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss']
})
export class SuccessComponent implements OnInit {
  
  public orderDetails : Order = {};
  public total: number;

  constructor(private orderService: OrderService, private cartService: CartService, private router: Router) { }

  ngOnInit() {
    this.orderDetails = this.orderService.getOrderItems();
    this.total = this.orderDetails.totalAmount+1.5;
  }

  public returnHome(){
    this.cartService.cleanCart();
    this.router.navigate(['index']);
  }

}
