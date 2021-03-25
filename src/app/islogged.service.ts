import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import {AuthService} from './auth.service';
@Injectable({
  providedIn: 'root'
})
export class IsloggedService implements CanActivate {
  constructor(private router:Router,private auth:AuthService) { }
  canActivate(){
    if(this.auth.verifyToken() == true){
      this.router.navigate(['/account/list']);
      return false;
    }
    return true;
  }
}
