import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ProductsService } from '../shared/services/products.service';
import { CartService } from '../shared/services/cart.service';
import { WishlistService } from '../shared/services/wishlist.service';

declare var $: any;

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  providers: [ProductsService, CartService, WishlistService]
})
export class MainComponent implements OnInit {
  
  public url : any; 

  constructor(private router: Router) { 
    
    this.router.events.subscribe((event) => {
          if (event instanceof NavigationEnd) {
            this.url = event.url;
          }
    });

  }

  ngOnInit() { 
   $.getScript('assets/js/script.js');
    //this.clearServices();
  }

  private clearServices(){
    let cart = JSON.parse(localStorage.getItem('cartItem'));
    console.log(cart);
    if(cart){
      cart.filter((item) => {
        console.log(item);
        if(item.product.category == 'plan'){
          localStorage.removeItem('cartItem');
          
        }
      });
    }
    sessionStorage.removeItem("fromCheckout");
  }

}
