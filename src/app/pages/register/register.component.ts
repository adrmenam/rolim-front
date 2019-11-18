import { Component, OnInit } from '@angular/core';
import { LoginService } from './../../shared/services/login.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Http } from '@angular/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  public registerForm: FormGroup;
  public validateOtpForm: FormGroup;
  public mensaje: any;
  public requireOtp: boolean = false;
  public countries: any;
  public country: any;

  constructor(public fb: FormBuilder, private loginService: LoginService, private router: Router, private toastrService: ToastrService, private http: Http) { 
    this.registerForm = this.fb.group({
      email: [{ value: '', disabled: this.requireOtp }, [Validators.required, Validators.email]],
      nombre: [{ value: '', disabled: this.requireOtp }, Validators.required],
      password: [{ value: '', disabled: this.requireOtp }, Validators.required],
      countrycode: ['', Validators.required],
      tel: [{ value: '', disabled: this.requireOtp }, Validators.required]
    });
    this.validateOtpForm = this.fb.group({
      otp: ['', Validators.required],
    });
  }

  ngOnInit() {
    //this.countries = this.http.get('assets/data/countries.json');
    this.countries = [{
      code: "+593",
      name: "Ecuador"
    }]
    this.country = this.countries[0].code;
    //this.requireOtp=sessionStorage.getItem('requireOtp')=='true'?true:false;
    sessionStorage.removeItem("fromCheckout");
  }

  register(){ 
    console.log(this.registerForm.value);
    // User data which we have received from the registration form.
    let formData = this.registerForm.value;
    formData['tel']=formData['countrycode']+formData['tel'];
    delete formData['countrycode'];
    console.log(formData);
    this.loginService.registerUser(formData).subscribe((response)=>{
      console.log(response);
      if(response['mensajeRetorno']=="Usuario Almacenado"){
        this.toastrService.success('El usuario se ha creado correctamente');  
        this.requireOtp=true;   
      }else if(response['mensajeRetorno']=="usuario ya existe"){
        this.toastrService.error("El usuario ya existe");
      }else{
        this.toastrService.error("El usuario no se pudo registrar");
      }
     });
  }

  validateOtp(){
    
    let obj={
      "email": this.registerForm.value.email,
      "password": this.registerForm.value.password,
      "otp": this.validateOtpForm.value.otp
    }
    console.log(obj);
    this.loginService.validateOtp(obj).subscribe((response)=>{
      console.log(response);
      // usuario activo
      if(response['codigoRetorno']=="0001"){
        this.toastrService.success('El usuario se ha activado correctamente');  
        localStorage.setItem("token", response['token']);
        localStorage.setItem("user", JSON.stringify(response['usuario']));
        
        this.router.navigate([''])
        .then(() => {
          window.location.reload(); 
        }); 
      }else{
        this.toastrService.error("Código incorrecto, el usuario no se pudo activar");
      }
     });
  }

}
