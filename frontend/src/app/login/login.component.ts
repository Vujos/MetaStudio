import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { FormErrorService } from 'src/app/shared/form-error.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loading = false;

  hide = true;

  public loginForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, public readonly formError: FormErrorService, private router: Router) { }

  message: string = "";

  ngOnInit() {
    this.loginForm = this.fb.group({
      emailInput: ['', { validators: [Validators.required] }],
      passwordInput: ['', { validators: [Validators.required] }]
    });
    if (this.authService.getCurrentRole() == "admin") {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/home']);
    }
  }

  onLogin() {
    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;
    this.authService.login(this.loginForm.value.emailInput, this.loginForm.value.passwordInput).subscribe(
      response => {
        this.loading = false;
        if (response.token) {
          localStorage.setItem('token', response.token);
          this.message = "";
          if (this.authService.getCurrentRole() == "admin") {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/home']);
          }
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
