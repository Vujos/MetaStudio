import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { UserService } from '../users/user.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormErrorService } from 'src/app/shared/formError.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  currentUser = undefined;

  loading = false;

  public form: FormGroup;
  message: string = "";
  hide = true;

  constructor(private authService: AuthService, private userService: UserService, public readonly formError: FormErrorService, private fb: FormBuilder) { }

  ngOnInit() {
    this.form = this.fb.group({
      fullName: ['', { validators: [Validators.required] }],
      username: ['', { validators: [Validators.required] }],
      email: ['', { validators: [Validators.required] }],
      oldPassword: ['', { validators: [Validators.required] }],
      newPassword: [''],
      repeatNewPassword: ['']
    });

    this.userService.getByQuery(this.authService.getCurrentUser()).subscribe(currentUser => {
      this.currentUser = currentUser;
      this.form.patchValue(this.currentUser);
    })
  }

  onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    let validOldPassword = false;

    this.authService.login2(this.form.value.email, this.form.value.oldPassword).subscribe(response => {
      if (response.token != "") {
        validOldPassword = true;
      }

      if (!validOldPassword) {
        this.message = "The password does not match!"
        return
      }

      if (this.form.value.newPassword != this.form.value.repeatNewPassword) {
        this.message = "The repeated password does not match!"
        return
      }

      this.loading = true;

      this.message = ""

      this.currentUser.fullName = this.form.value.fullName.trim();
      this.currentUser.username = this.form.value.username.trim();
      this.currentUser.email = this.form.value.email.trim();
      if (this.form.value.newPassword != "") {
        this.currentUser.password = this.form.value.newPassword;
      }
      this.currentUser.password = this.form.value.oldPassword;

      this.userService.updateWithPassword(this.currentUser.id, this.currentUser).subscribe(
        () => {
          this.loading = false;
          this.form.controls["oldPassword"].reset();
          this.form.controls["newPassword"].reset();
          this.form.controls["repeatNewPassword"].reset();
        });
    }, e => {
      if (!validOldPassword) {
        this.message = "The password does not match!"
        return
      }
    });
  }

}
