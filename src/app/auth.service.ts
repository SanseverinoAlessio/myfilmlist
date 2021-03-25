import { Injectable } from '@angular/core';
import { JwtHelperService } from "@auth0/angular-jwt";
import {HttpClient,HttpHeaders} from '@angular/common/http';
import {environment} from './../environments/environment';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  subj = new Subject<boolean>();
  public loggedObservable = this.subj.asObservable();
  constructor(private http:HttpClient) {
  }
  verifyToken(){
    const helper = new JwtHelperService();
    let token = localStorage.getItem('token');
    if(token == null || token.length <= 0 || helper.isTokenExpired(token) == true)
    {
      return false;
    }
    return true;
  }
  isAdmin(){
    return this.http.get(environment.server + '/api/auth/isadmin');
  }
  getAccountInfo(){
    return this.http.get(environment.server + '/api/auth/getAccountInfo');
  }
  logout(){
    localStorage.removeItem('token');
  }
  changeLoggedState(state:boolean){
    this.subj.next(state);
  }
  deleteAccount(){
    return this.http.delete(environment.server + '/api/auth/delete');
  }
}
