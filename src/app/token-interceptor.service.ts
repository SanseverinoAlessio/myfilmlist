import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {
  constructor() { }
  intercept(req: HttpRequest<any>, next: HttpHandler):Observable<HttpEvent<any>>{
    let token = localStorage.getItem('token');
    if( token == undefined || token.length <= 0){
      return next.handle(req);
    }
    req = req.clone({
      setHeaders:{
        Authorization: 'Bearer ' + token,
      }
    });
    return next.handle(req);
  }
}
