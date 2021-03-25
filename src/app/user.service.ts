import { Injectable } from '@angular/core';
import {environment} from './../environments/environment';
import {HttpClient,HttpHeaders} from '@angular/common/http';
import { debounceTime } from 'rxjs/operators';
import {map,switchMap,delay} from 'rxjs/operators';
import { AbstractControl, ValidationErrors,AsyncValidatorFn } from '@angular/forms';
import {Observable,interval,of} from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http:HttpClient) { }
  register(data:{username:string,
    email:string,
    password:string}){
      console.log(data);
      return this.http.post(environment.server + '/api/user/register',data);
    }
    login(data:{
      email:string,
      password:string,
    }){
      return this.http.post(environment.server + '/api/user/login', data);
    }
    uniqueEmail():AsyncValidatorFn{
      return (control:AbstractControl): Observable<{[key:string] :any} | null>  => {
        return of(control.value).pipe(
          delay(400),
          switchMap((value)=>{
            console.log(this);
            return this.http.get(environment.server + '/api/user/email/' + value).pipe(
              map((res:any)=>{
                return res.found == true ? {exist:true} : null;
              }),
            );
          }),
        );
      }
    }
    getUsers(data:{
      page:Number,
      perpage?: Number
    }){
      let perpage = data.perpage || 10;
      return this.http.get(environment.server + '/api/user?page=' + data.page + '&perpage=' + perpage);
    }
    deleteUser(id:string){
      return this.http.delete(environment.server + '/api/user/' + id);
    }
    updateAdmin(data:{
      id:string,
      value:boolean
    }){
      return this.http.put(environment.server + '/api/user/' + data.id,{admin: data.value});
    }
    search(name){
      return this.http.get(environment.server + '/api/user/search/' + name);
    }
    sendResetPassword(email){
      return this.http.post(environment.server + '/api/user/sendResetToken',{email:email});
    }
    resetPassword(data:{
      token: string,
      newPassword:string
    }){
      return this.http.put(environment.server + '/api/user/resetPassword/' + data.token,{newPassword:data.newPassword});
    }
    verifyPasswordToken(token){
     return this.http.get(environment.server + '/api/user/passwordTokenExist/' + token);
    }
  }
