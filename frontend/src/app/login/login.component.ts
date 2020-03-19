import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService } from '../auth/auth.service';
import { FormErrorService } from '../shared/formError.service';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  message: string = "";

  constructor(public dialogRef: MatDialogRef<LoginComponent>, 
    private authService : AuthService, public readonly formError: FormErrorService) { }

  ngOnInit() {
  }

  onLogin(form: NgForm){
    if (form.invalid) {
      return;
    }
    this.authService.login(form.value.username, form.value.password).subscribe(
      {
        next: response => {
          if(response.token){
            localStorage.setItem('token', response.token);
            this.message = "";
            this.dialogRef.close();
          }else{
            this.message = "Incorect username or password";
          }
        },
        error: () => {
          this.message = "Incorect username or password";
        }
      }
    );
  }

}
