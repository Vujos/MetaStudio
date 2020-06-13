import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import decode from 'jwt-decode';

@Injectable({ providedIn: "root" })
export class AuthService {
  constructor(private http: HttpClient, private router: Router) { }

  login(email: string, password: string) {
    return this.http.post<{ token: string }>("http://localhost:8080/api/users/login", { email: email, password: password });
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }

  getCurrentUser() {
    const token = localStorage.getItem('token');
    if (token) {
      return decode(token).sub;
    }
    return null;
  }

  getCurrentRole() {
    const token = localStorage.getItem('token');
    if (token) {
      return decode(token).role[0].authority;
    }
    return null;
  }

  isLoggedIn() {
    if (localStorage.getItem('token')) {
      return true;
    }
    return false;
  }

}