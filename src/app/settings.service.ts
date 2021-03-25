import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders} from '@angular/common/http';
import {environment} from './../environments/environment';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  changeInfo = new Subject<boolean>();
  getInfo = this.changeInfo.asObservable();
  constructor(private http:HttpClient) { }
  updateNavInfo(){
    this.changeInfo.next(true);
  }
  updateInformation(data:{
    email:string,
    username: string,
  }){
    return this.http.put(environment.server + '/api/auth/updateInformation',data);
  }
  deleteAccount(){
    return this.http.delete(environment.server + '/api/auth/delete');
  }
  updatePassword(data:{
    oldPassword: string,
    newPassword:string,
  }){
    return this.http.put(environment.server + '/api/auth/updatePassword',data);
  }
  updateAvatar(fileImage){
    let fileData = new FormData();
    fileData.append('avatar',fileImage,fileImage.name);
    return this.http.put(environment.server + '/api/auth/updateAvatar',fileData);
  }
  deleteAvatar(){
    return this.http.delete(environment.server + '/api/auth/removeAvatar');
  }
}
