import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AddressService } from './../../shared/services/address.service';
import { ToastrService } from 'ngx-toastr';

//let google: any;
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
  public address: any;
  public geoCoder: any;
  public addressNumber: String = "";
  public addressCity: String = "";
  public addressCountry: String = "";
  public addressZipCode: String = "";
  public latlong: String = "";
  public alias: any;
  public addressForm: FormGroup;

  @ViewChild('search',{static:false})
  public searchElementRef: ElementRef;
  


  constructor(public fb: FormBuilder, private addressService: AddressService, private mapsAPILoader: MapsAPILoader, private ngZone: NgZone, private toastrService: ToastrService) { 
    this.addressForm = this.fb.group({
      direccion: [{value: '', disabled: true}, Validators.required],
      direccion2: ['', Validators.required],
      lalo: [{value: '', disabled: true}, Validators.required],
      ciudad: [{value: '', disabled: true}, Validators.required],
      pais: [{value: '', disabled: true}, Validators.required],
      alias: ['casa', Validators.required],
      referencia: ['', Validators.required]
    });
  }

  ngOnInit() {
    
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder;
 
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ["address"]
      });
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
 
          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
 
          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.zoom = 12;
        });
      });
    });

    //inicialización en caso de que no se obtenga data.
    //this.alias='casa';
  }

  saveAddress(){ 
    console.log(this.addressForm.value);
    // User data which we have received from the address form.
    let obj = {
      "direccion": this.address + " | " + this.addressForm.value.direccion2,
      "lalo": this.latlong,
      "ciudad": this.addressCity,
      "pais": this.addressCountry,
      "referencia": this.addressForm.value.referencia,
      "alias": this.addressForm.value.alias
    }
    console.log(obj);
    console.log(localStorage.getItem("token"));
    this.addressService.saveAddress(obj, localStorage.getItem("token")).subscribe((response)=>{
      console.log(response);
      if(response['codigoRetorno']=="0001"){
        this.toastrService.success('Dirección guardada correctamente'); 
      }else{
        this.toastrService.error('La dirección no se pudo guardar: '+response['mensajeRetorno']); 
        
      }
      
     });
  }


  // Get Current Location Coordinates
  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 8;
        this.getAddress(this.latitude, this.longitude);
      });
    }
  }

  markerDragEnd($event: any) {
    console.log($event);
    this.latitude = $event.coords.lat;
    this.longitude = $event.coords.lng;
    this.getAddress(this.latitude, this.longitude);
  }
 
  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      console.log(results);
      console.log(status);
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          this.address = results[0].formatted_address;
          //this.addressNumber = results[0].address_components.filter(component => component.types[0]=="route")[0].long_name+", "+results[0].address_components.filter(component => component.types[0]=="street_number")[0].long_name;
          this.addressCity = results[0].address_components.filter(component => component.types[0]=="locality")[0].long_name;
          this.addressZipCode = results[0].address_components.filter(component => component.types[0]=="postal_code")[0].long_name;
          this.addressCountry = results[0].address_components.filter(component => component.types[0]=="country")[0].long_name;
          //console.log(results[0].address_components.filter(component => component.types[0]=="country"));
          this.latlong = latitude+', '+longitude;
        } else {
          window.alert('No se encontraron resultados');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
 
    });
  }
  

}
