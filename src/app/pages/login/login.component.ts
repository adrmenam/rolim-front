import { Component, OnInit } from '@angular/core';
import { LoginService } from './../../shared/services/login.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { CartService } from './../../shared/services/cart.service';
import { ToastrService } from 'ngx-toastr';

import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  public loginForm: FormGroup;
  public validateOtpForm: FormGroup;
  public mensaje: any;
  public requireOtp: boolean = false;

  constructor(public fb: FormBuilder, private loginService: LoginService, private router: Router, private cartService: CartService, private toastrService: ToastrService) { 
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    this.validateOtpForm = this.fb.group({
      otp: ['', Validators.required],
    });
  }

  ngOnInit() {
    
  }

  login(){ 
    console.log(this.loginForm.value);
    // User data which we have received from the registration form.
    
    this.loginService.login(this.loginForm.value).subscribe((response)=>{
      console.log(response);
      if(response['codigoRetorno']=="0001"){
        localStorage.setItem("token", response['token']);
        localStorage.setItem("user", JSON.stringify(response['usuario']));
        
        this.router.navigate([''])
        .then(() => {
          window.location.reload();
        });
      }else if(response['codigoRetorno']=="0003"){
        this.requireOtp=true; 

      }else{
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        this.cartService.cleanCart();
        
      }
      this.mensaje=response['mensajeRetorno'];
     });
  }

  validateOtp(){
    
    let obj={
      "email": this.loginForm.value.email,
      "password": this.loginForm.value.password,
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

  goToRegister(){
    this.router.navigate(['pages/register']);
  }

}
