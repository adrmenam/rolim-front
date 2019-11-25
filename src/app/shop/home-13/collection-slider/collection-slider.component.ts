import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SubscriptionService } from '../../../shared/services/subscription.service';

@Component({
  selector: 'app-collection-slider-thirteen',
  templateUrl: './collection-slider.component.html',
  styleUrls: ['./collection-slider.component.scss']
})
export class CollectionSliderThirteenComponent implements OnInit {

  public categories;
   // DomSanitizer for safe html content.
  constructor(private _sanitizer:DomSanitizer, private subscriptionService: SubscriptionService) { }

  ngOnInit() {
    var planes = [];
    this.subscriptionService.getPlans().subscribe((response)=>{
      console.log(response);
      if(response['codigoRetorno']=="0001"){
        
      }
      for(var i=0;i<response['retorno'].length;i++){
        var htmlText="";
        for(var j=0;j<response['retorno'][i]['productosPlan'].length;j++){
          htmlText += '<li><a href="#void">'+response['retorno'][i]['productosPlan'][j]['cantidad']+' '+response['retorno'][i]['productosPlan'][j]['descripcion']+'</a></li>';
        }
        let plan;
        plan = {
          image: 'assets/images/laundry/product/'+response['retorno'][i]['icono'],
          title: response['retorno'][i]['nombre'],
          text:  htmlText+'<li><a href="#void">'+response['retorno'][i]['domicilios']+' domicilios</a></li>'+'<li><a href="#void">'+response['retorno'][i]['valor']+'</a></li>',
          url: '/home/no-sidebar/product/'+response['retorno'][i]['plan']
        }
       
        //console.log(product);
        planes.push(plan);
        //console.log(productos);
      }
      
      
      //console.log(planes);
      this.categories = planes;
      //return res.json();

     });
  }

   // services
  /*public categories = [{
    image: 'assets/images/laundry/product/estudiantil.jpg',
    title: 'Plan Estudiantil',
    text:  '<li><a href="#">2 fundas de lavado</a></li><li><a href="#">0 prendas de planchado</a></li><li><a href="#">$21.00</a></li>',
    url: '/home/no-sidebar/product/1001'
    }, {
      image: 'assets/images/laundry/product/estudiantil_premium.jpg',
      title: 'Plan Estudiantil Premium',
      text:  this._sanitizer.bypassSecurityTrustHtml('<li><a href="#">2 fundas de lavado</a></li><li><a href="#">12 prendas de planchado</a></li><li><a href="#">$35.00</a></li>'),
      url: '/home/no-sidebar/product/1002'
    }, {
      image: 'assets/images/laundry/product/soltero.jpg',
      title: 'Plan Soltero/a',
      text:  this._sanitizer.bypassSecurityTrustHtml('<li><a href="#">2 fundas de lavado</a></li><li><a href="#">24 prendas de planchado</a></li><li><a href="#">$48.00</a></li>'),
      url: '/home/no-sidebar/product/1003'
    }, {
      image: 'assets/images/laundry/product/colegas.jpg',
      title: 'Plan Colegas',
      text:  this._sanitizer.bypassSecurityTrustHtml('<li><a href="#">4 fundas de lavado</a></li><li><a href="#">0 prendas de planchado</a></li><li><a href="#">$40.00</a></li>'),
      url: '/home/no-sidebar/product/1004'
    }, {
      image: 'assets/images/laundry/product/ejecutivo.jpg',
      title: 'Plan Ejecutivo',
      text:  this._sanitizer.bypassSecurityTrustHtml('<li><a href="#">4 fundas de lavado</a></li><li><a href="#">12 prendas de planchado</a></li><li><a href="#">$52.00</a></li>'),
      url: '/home/no-sidebar/product/1005'
    },{
      image: 'assets/images/laundry/product/ejecutivo_premium.jpg',
      title: 'Plan Ejecutivo Premium',
      text:  this._sanitizer.bypassSecurityTrustHtml('<li><a href="#">4 fundas de lavado</a></li><li><a href="#">24 prendas de planchado</a></li><li><a href="#">$64.00</a></li>'),
      url: '/home/no-sidebar/product/1006'
    },
    {
      image: 'assets/images/laundry/product/familiar.jpg',
      title: 'Plan Familiar',
      text:  this._sanitizer.bypassSecurityTrustHtml('<li><a href="#">8 fundas de lavado</a></li><li><a href="#">24 prendas de planchado</a></li><li><a href="#">$104.00</a></li>'),
      url: '/home/no-sidebar/product/1007'
    },
    {
      image: 'assets/images/laundry/product/familiar_premium.jpg',
      title: 'Plan Familiar Premium',
      text:  this._sanitizer.bypassSecurityTrustHtml('<li><a href="#">8 fundas de lavado</a></li><li><a href="#">48 prendas de planchado</a></li><li><a href="#">$128.00</a></li>'),
      url: '/home/no-sidebar/product/1008'
    }
  ]*/



   // Slick slider config
  public catSlideConfig = {
    infinite: true,
    speed: 300,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [{
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3
        }
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      },
      {
        breakpoint: 586,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

}
