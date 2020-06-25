import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormErrorService } from 'src/app/shared/form-error.service';
import { User } from '../models/user.model';
import { UserService } from '../users/user.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  loading = false;

  public form: FormGroup;
  public user: User = new User();
  message: string = "";
  hide = true;

  constructor(private userService: UserService, private authService: AuthService, public readonly formError: FormErrorService, private fb: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.form = this.fb.group({
      fullName: ['', { validators: [Validators.required] }],
      username: ['', { validators: [Validators.required, Validators.pattern("^(?!@.*$).*")] }],
      email: ['', { validators: [Validators.required, Validators.email] }],
      password: ['', { validators: [Validators.required] }]
    });
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home']);
      return
    }
  }

  onRegister() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    this.user.fullName = this.form.value.fullName;
    this.user.username = this.form.value.username;
    this.user.email = this.form.value.email;
    this.user.password = this.form.value.password;

    this.userService.add(this.user).subscribe(
      () => {
        this.loading = false;
        this.form.reset();
        this.router.navigate(['/login']);
      },
      (e) => {
        if (e.status == 409) {
          this.message = "Email address is already used";
        }
        else if (e.status == 406) {
          this.message = "Username is already used";
        }
        this.loading = false;
      });
  }

}

