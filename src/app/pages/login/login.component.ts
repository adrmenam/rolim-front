import { Component, OnInit } from '@angular/core';
import { LoginService } from './../../shared/services/login.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';

import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  public loginForm: FormGroup;
  public mensaje: any;

  constructor(public fb: FormBuilder, private loginService: LoginService, private router: Router) { 
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    
  }

  login(){ 
    console.log(this.loginForm.value);
    // User data which we have received from the registration form.
    
    this.loginService.login(this.loginForm.value).subscribe((response)=>{
      console.log(response);
      if(response['mensajeRetorno']=="consulta correcta"){
        localStorage.setItem("token", JSON.stringify(response['token']));
        localStorage.setItem("user", JSON.stringify(this.loginForm.value['email']));
        
        this.router.navigate([''])
        .then(() => {
          window.location.reload();
        });
      }else{
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        
      }
      this.mensaje=response['mensajeRetorno'];
     });
  }

  goToRegister(){
    this.router.navigate(['pages/register'])
  }

}
