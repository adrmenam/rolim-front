import { Component, OnInit, OnDestroy } from '@angular/core';
import { Product } from '../../shared/classes/product';
import { ProductsService } from '../../shared/services/products.service';
import { AddressService } from './../../shared/services/address.service';
import { GeneralService } from './../../shared/services/general.service';

declare var $: any;

@Component({
  selector: 'app-home-thirteen',
  templateUrl: './home-thirteen.component.html',
  styleUrls: ['./home-thirteen.component.scss']
})
export class HomeThirteenComponent implements OnInit, OnDestroy {

  public products: Product[] = [];
  
  constructor(private generalService: GeneralService, private productsService: ProductsService, private addressService: AddressService) {   }

  ngOnInit() {
  	this.productsService.getProducts().subscribe(product => { 
  	  product.filter((item: Product) => {
         if(item.category == 'individual')
           this.products.push(item)
      })
    });
    
    document.body.classList.add('tools-bg'); // Add class in body
    document.getElementsByClassName("header-type")[0].classList.add("header-tools");  // Change header 4 class
    this.getAddresses();
    this.getConfigurations();
  }

  ngOnDestroy(){
    document.body.classList.remove('tools-bg');
    document.getElementsByClassName("header-type")[0].classList.remove("header-tools");
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
