import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-logo-thirteen',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss']
})
export class LogoThirteenComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  // Slick slider config
  public logoSlideConfig: any = {
    dots: false,
    infinite: false,
    speed: 300,
    slidesToShow: 2,
    slidesToScroll: 2,
    responsive: [{
        breakpoint: 1367,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 0,
          infinite: false
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 0,
          infinite: false
        }
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 0,
          infinite: false
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 0
        }
      }
    ]
  };

  // Logo
  public logo = [{
      image: 'assets/images/download/appstore.png',
    }, {
      image: 'assets/images/download/googleplay.png',
    }]

}
