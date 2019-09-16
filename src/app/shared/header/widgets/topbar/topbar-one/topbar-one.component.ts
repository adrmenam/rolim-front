import { Component, OnInit, Output } from '@angular/core';
import { Product } from '../../../../classes/product';
import { WishlistService } from '../../../../services/wishlist.service';
import { ProductsService } from '../../../../../shared/services/products.service';
import { LoginService } from '../../../../../shared/services/login.service';
import { Observable, of } from 'rxjs';


@Component({
  selector: 'app-topbar',
  templateUrl: './topbar-one.component.html',
  styleUrls: ['./topbar-one.component.scss']
})
export class TopbarOneComponent implements OnInit {
  
  @Output() public user: any;

  constructor(public productsService: ProductsService, private loginService: LoginService) { 
    this.user = localStorage.getItem("user")?localStorage.getItem("user").split('@')[0].split('"')[1]:'';
  }

  ngOnInit() { 
    
  }

  logout(){
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
  }


}
