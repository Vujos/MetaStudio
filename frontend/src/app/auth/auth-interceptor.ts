import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { AuthService } from './auth.service';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private router: Router, private authService: AuthService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const token = localStorage.getItem('token');
        const origin = "http://localhost:4200";
        if (token) {
            const authRequest = req.clone({
                headers: req.headers.set("Authorization", token).set("Access-Control-Allow-Origin", origin)
            });
            return next.handle(authRequest).pipe(
                tap(null,
                    error => {
                        if(error.status == 403){
                            this.authService.logout();
                            //this.router.navigate(['/login']);
                        }
                    }
                )
            );
        }
        return next.handle(req).pipe(
            tap(null,
                error => {
                    if(error.status == 403){
                        this.authService.logout();
                        //this.router.navigate(['/login']);
                    }
                }
            )
        );
    }

}