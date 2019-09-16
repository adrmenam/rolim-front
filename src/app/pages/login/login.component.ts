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
    
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: [''],
      Password: ['']
    });
  }

  login(userdata){ 
    console.log(userdata);
    // User data which we have received from the registration form.
    this.loginService.login(userdata).subscribe((response)=>{
      console.log(response);
     }); 
  }

}
