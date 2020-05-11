import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { FormErrorService } from 'src/app/shared/formError.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.scss']
})
export class LoginRegisterComponent implements OnInit {

  loading = false;

  hide = true;

  public loginForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, public readonly formError: FormErrorService, private router: Router) { }

  message: string = "";

  ngOnInit() {
    this.loginForm = this.fb.group({
      emailInput: ['', { validators: [Validators.required] }],
      passwordInput: ['', { validators: [Validators.required] }]
    })
  }

  onLogin() {
    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;
    this.authService.login2(this.loginForm.value.emailInput, this.loginForm.value.passwordInput).subscribe(
      response => {
        this.loading = false;
        if (response.token) {
          localStorage.setItem('token', response.token);
          this.message = "";
          this.router.navigate(['/boards']);
        } else {
          this.message = "Wrong email and/or password";
        }
      },
      () => {
        this.loading = false;
        this.message = "Wrong email and/or password";
      });
  }
}
