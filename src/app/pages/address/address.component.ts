import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit {

  public latitude = -0.173146;
  public longitude = -78.477032;
  public mapType = 'roadmap';
  public zoom = 14;
  public selectedMarker;
  public markers = [];


  constructor() { }

  ngOnInit() {
  }

  public addMarker(lat: number, lng: number) {
    //if(!this.selectedMarker){
      this.markers.push({ lat, lng, alpha: 0.4 });
    //   this.selectedMarker = {
    //     lat: lat,
    //     lng: lng
    //   }
    // }

    
  }

  public selectMarker(event) {
    console.log("selectMarker()"+", lat: "+event.latitude+", lng: "+event.longitude);
    
    if(this.selectedMarker){
      this.selectedMarker.lat = event.latitude;
      this.selectedMarker.lng = event.longitude;
    }else{
      this.selectedMarker = {
        lat: event.latitude,
        lng: event.longitude
      };
    }
  }

}
