import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-collection-slider-thirteen',
  templateUrl: './collection-slider.component.html',
  styleUrls: ['./collection-slider.component.scss']
})
export class CollectionSliderThirteenComponent implements OnInit {

   // DomSanitizer for safe html content.
  constructor(private _sanitizer:DomSanitizer) { }

  ngOnInit() {
  }

   // services
  public categories = [{
    image: 'assets/images/laundry/product/estudiantil.jpg',
    title: 'Plan Estudiantil',
    text:  this._sanitizer.bypassSecurityTrustHtml('<li><a href="#">2 fundas de lavado</a></li><li><a href="#">0 prendas de planchado</a></li><li><a href="#">$21.00</a></li>'),
    url: '/home/no-sidebar/product/1'
  }, {
    image: 'assets/images/laundry/product/estudiantil_premium.jpg',
    title: 'Plan Estudiantil Premium',
    text:  this._sanitizer.bypassSecurityTrustHtml('<li><a href="#">2 fundas de lavado</a></li><li><a href="#">12 prendas de planchado</a></li><li><a href="#">$35.00</a></li>'),
    url: '/home/no-sidebar/product/2'
  }, {
    image: 'assets/images/laundry/product/soltero.jpg',
    title: 'Plan Soltero/a',
    text:  this._sanitizer.bypassSecurityTrustHtml('<li><a href="#">2 fundas de lavado</a></li><li><a href="#">24 prendas de planchado</a></li><li><a href="#">$48.00</a></li>'),
    url: '/home/no-sidebar/product/3'
  }, {
    image: 'assets/images/laundry/product/colegas.jpg',
    title: 'Plan Colegas',
    text:  this._sanitizer.bypassSecurityTrustHtml('<li><a href="#">4 fundas de lavado</a></li><li><a href="#">0 prendas de planchado</a></li><li><a href="#">$40.00</a></li>'),
    url: '/home/no-sidebar/product/4'
  }, {
    image: 'assets/images/laundry/product/ejecutivo.jpg',
    title: 'Plan Ejecutivo',
    text:  this._sanitizer.bypassSecurityTrustHtml('<li><a href="#">4 fundas de lavado</a></li><li><a href="#">12 prendas de planchado</a></li><li><a href="#">$52.00</a></li>'),
    url: '/home/no-sidebar/product/5'
  },{
    image: 'assets/images/laundry/product/ejecutivo_premium.jpg',
    title: 'Plan Ejecutivo Premium',
    text:  this._sanitizer.bypassSecurityTrustHtml('<li><a href="#">4 fundas de lavado</a></li><li><a href="#">24 prendas de planchado</a></li><li><a href="#">$64.00</a></li>'),
    url: '/home/no-sidebar/product/6'
  },
  {
    image: 'assets/images/laundry/product/familiar.jpg',
    title: 'Plan Familiar',
    text:  this._sanitizer.bypassSecurityTrustHtml('<li><a href="#">8 fundas de lavado</a></li><li><a href="#">24 prendas de planchado</a></li><li><a href="#">$104.00</a></li>'),
    url: '/home/no-sidebar/product/7'
  },
  {
    image: 'assets/images/laundry/product/familiar_premium.jpg',
    title: 'Plan Familiar Premium',
    text:  this._sanitizer.bypassSecurityTrustHtml('<li><a href="#">8 fundas de lavado</a></li><li><a href="#">48 prendas de planchado</a></li><li><a href="#">$128.00</a></li>'),
    url: '/home/no-sidebar/product/8'
  }
]

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
