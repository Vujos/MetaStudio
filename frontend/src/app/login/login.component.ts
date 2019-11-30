import { Component, OnInit } from '@angular/core';

import { NgForm } from '@angular/forms';
import { FormErrorService } from '../shared/formError.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
