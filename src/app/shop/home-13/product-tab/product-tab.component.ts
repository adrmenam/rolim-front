import { Component, OnInit, Input } from '@angular/core';
import { Product } from '../../../shared/classes/product';
declare var $: any;

@Component({
  selector: 'app-product-tab-thirteen',
  templateUrl: './product-tab.component.html',
  styleUrls: ['./product-tab.component.scss']
})
export class ProductTabThirteenComponent implements OnInit {
  
  // Get product Using Input
  @Input() products: Product[];

  public productsArray: Product[];
  public cat1: Product[];
  public cat2: any;
  public cat3: any;
  public cat4: any;
  public cat5: any;

  constructor() { }

  ngOnInit() {
     // tab js
      $("#tab-1").css("display", "Block");
    $(".default").css("display", "Block");
    $(".tabs li a").on('click', function() {
      event.preventDefault();
      $(this).parent().parent().find("li").removeClass("current");
      $(this).parent().addClass("current");
      var currunt_href = $(this).attr("href");
      $('#' + currunt_href).show();
      $(this).parent().parent().parent().find(".tab-content").not('#' + currunt_href).css("display", "none");
    });

    this.productsArray=this.products;
    console.log(this.products);
    console.log(this.productsArray.filter(product=>true));
  }

  // Slick slider config
  public productSlideConfig: any = {
    infinite: true,
    speed: 300,
    slidesToShow: 4,
    slidesToScroll: 4,
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
        breakpoint: 420,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

}
