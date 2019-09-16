import { Component, OnInit } from '@angular/core';
import { LoginService } from './../../shared/services/login.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

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

  constructor(public fb: FormBuilder, private loginService: LoginService, private router: Router, private toastrService: ToastrService) { 
    this.registerForm = this.fb.group({
      email: [{ value: '', disabled: this.requireOtp }, [Validators.required, Validators.email]],
      nombre: [{ value: '', disabled: this.requireOtp }, Validators.required],
      password: [{ value: '', disabled: this.requireOtp }, Validators.required],
      tel: [{ value: '', disabled: this.requireOtp }, Validators.required]
    });
    this.validateOtpForm = this.fb.group({
      otp: ['', Validators.required],
    });
  }

  ngOnInit() {
  }

  register(){ 
    console.log(this.registerForm.value);
    // User data which we have received from the registration form.
    
    this.loginService.registerUser(this.registerForm.value).subscribe((response)=>{
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
      if(response['mensajeRetorno']=="usuario activo"){
        this.toastrService.success('El usuario se ha activado correctamente');  
        localStorage.setItem("token", JSON.stringify(response['token']));
        localStorage.setItem("user", JSON.stringify(this.registerForm.value['email']));
        
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
