import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import decode from 'jwt-decode';
import { Subject } from 'rxjs';

@Injectable({ providedIn: "root" })
export class AuthService {

  loggedInStatusChanged = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string){
    this.http.post<{token: string}>("http://localhost:8080/login", {username: username, password: password}).subscribe(response =>{
      if(response.token){
        localStorage.setItem('token', response.token);
        this.router.navigate(['/']);
        this.loggedInStatusChanged.next(true);
      }
    });
  }

  logout(){
    localStorage.removeItem('token');
    this.router.navigate(['/']);
    this.loggedInStatusChanged.next(false);
  }

  getCurrentUser(){
    const token = localStorage.getItem('token');
    if(token){
      return decode(token).sub;
    }
    return null;
  }

  isLoggedIn(){
    if(localStorage.getItem('token')){
      return true;
    }
    return false;
  }

}