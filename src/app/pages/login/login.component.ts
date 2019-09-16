import { Component, OnInit } from '@angular/core';
import {LoginService} from './../../shared/services/login.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  public loginForm: FormGroup;

  constructor(public fb: FormBuilder, private loginService: LoginService) { 
    this.loginForm = this.fb.group({
      email: [''],
      password: ['']
    });
  }

  ngOnInit() {
    
  }

  login(){ 
    console.log(this.loginForm.value);
    // User data which we have received from the registration form.
    var obj = 
      {
        "transaccion": "autenticarUsuario",
        "datosUsuario": this.loginForm.value
      }
    
    this.loginService.login(obj).subscribe((response)=>{
      console.log(response);
      
     });
  }

}
