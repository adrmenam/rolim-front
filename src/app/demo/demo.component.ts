import { Component, OnInit, ViewEncapsulation ,Inject, HostListener} from '@angular/core';
import { trigger, state, transition, style, animate } from '@angular/animations';  
import { DOCUMENT } from '@angular/common';
declare var $: any;

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations:[ 
    trigger('fade',
    [ 
      state('void', style({ opacity : 0})),
      transition(':enter',[ animate(300)]),
      transition(':leave',[ animate(500)]),
    ]
  )]
})
export class DemoComponent implements OnInit {

  constructor(@Inject(DOCUMENT) document) { }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(e) {
     if (window.pageYOffset > 550) {
       let element = document.getElementById('header-stick');
       element.classList.add('sticky');
     } else {
      let element = document.getElementById('header-stick');
        element.classList.remove('sticky'); 
     }
  }

  ngOnInit() {
  	$.getScript('assets/js/script.js');
  }

}
