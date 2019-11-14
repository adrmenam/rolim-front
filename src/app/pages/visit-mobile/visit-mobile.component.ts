import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-visit-mobile',
  templateUrl: './visit-mobile.component.html',
  styleUrls: ['./visit-mobile.component.scss']
})
export class VisitMobileComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    sessionStorage.removeItem("fromCheckout");
  }

  public returnHome(){
    this.router.navigate(['index']);
  }

}
