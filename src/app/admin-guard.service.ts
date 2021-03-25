import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import {AuthService} from './auth.service';
import { map,catchError } from 'rxjs/operators';
import { Observable,of } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AdminGuardService implements CanActivate {
  constructor(private router:Router,private auth:AuthService) { }
  canActivate():Observable<boolean> | boolean{
    if(this.auth.verifyToken() == false){
      this.router.navigate(['home']);
      return false;
    }
    return this.auth.isAdmin().pipe(
      map((res:any)=>{
        if(res){
          return true;
        }
        this.router.navigate(['home']);
        return false;
      }),
      catchError(err=>{
        this.router.navigate(['home']);
        return of(false);
      }),
    );

  }
}
