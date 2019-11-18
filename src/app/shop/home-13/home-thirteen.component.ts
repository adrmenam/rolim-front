import { Component, OnInit, OnDestroy } from '@angular/core';
import { Product } from '../../shared/classes/product';
import { ProductsService } from '../../shared/services/products.service';
import { AddressService } from './../../shared/services/address.service';
import { GeneralService } from './../../shared/services/general.service';
import { CartService } from './../../shared/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-home-thirteen',
  templateUrl: './home-thirteen.component.html',
  styleUrls: ['./home-thirteen.component.scss']
})
export class HomeThirteenComponent implements OnInit, OnDestroy {

  public products: Product[] = [];
  
  constructor(private cartService: CartService,private router: Router, private generalService: GeneralService, private productsService: ProductsService, private addressService: AddressService, private toastrService: ToastrService) { 
    this.clearServices();
  }

  ngOnInit() {
  	this.productsService.getProducts().subscribe(product => { 
      console.log(product);
  	  product.filter((item: Product) => {
         if(item.category == 'individual')
           this.products.push(item);
      })
    });
    
    document.body.classList.add('tools-bg'); // Add class in body
    document.getElementsByClassName("header-type")[0].classList.add("header-tools");  // Change header 4 class
    this.getAddresses();
    this.getConfigurations();
    /*let user = localStorage.getItem('user');
    if(user){
      this.router.navigate(['']);
    }*/
    
  }

  ngOnDestroy(){
    document.body.classList.remove('tools-bg');
    document.getElementsByClassName("header-type")[0].classList.remove("header-tools");
  }

  private clearServices(){
    let cart = JSON.parse(localStorage.getItem('cartItem'));
    console.log(cart);
    if(cart){
      cart.filter((item) => {
        console.log(item);
        if(item.product.category == 'plan'){
          this.cartService.cleanCart();
          this.toastrService.info("Se ha limpiado el carrito ya que no se ha completado la subscripción al plan");
          this.router.navigate(['']);
        }
      });
    }
  }
  
  private getAddresses(){
    this.addressService.getAddresses(localStorage.getItem("token")).subscribe((response)=>{
      //console.log(response);
      if(response['codigoRetorno']=="0001"){
        localStorage.setItem("addresses", JSON.stringify(response['data']));
      }
     });
  }
  

  private getConfigurations(){
    this.generalService.getConfiguration().subscribe((response)=>{
      console.log(response);
      if(response['codigoRetorno']=="0001"){
        let data = response['retorno'];
        for(let item of data){
            sessionStorage.setItem(item.item, item.valor);
        }
        
      }
     });
  }

}
