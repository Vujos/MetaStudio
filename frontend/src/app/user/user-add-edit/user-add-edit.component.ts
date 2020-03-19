import { User } from './../user.model';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { NgForm } from '@angular/forms';
import { FormErrorService } from 'src/app/shared/formError.service';

@Component({
  selector: 'app-user-add-edit',
  templateUrl: './user-add-edit.component.html',
  styleUrls: ['./user-add-edit.component.scss']
})
export class UserAddEditComponent implements OnInit {

  public user = new User();
  message : string = "";
  message_color : string;

  constructor(private userService: UserService, public formError: FormErrorService) { }

  ngOnInit() {
  }

  onRegister(form: NgForm) {
    if (form.invalid) {
      return;
    } else {
      const user = form.value;
      delete user['confirmPassword'];

      this.user = user;
      this.userService.add(this.user).subscribe({
        next: () => {
          this.message_color = "green";
          this.message = "Registration Successful";
        },
        error: () => {
          this.message_color = "red";
          this.message = "That username already exist.";
        }
      });
    }
  }

}