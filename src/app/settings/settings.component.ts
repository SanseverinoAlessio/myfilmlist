import { Component, OnInit } from '@angular/core';
import { FormControl,FormGroup, Validators } from '@angular/forms';
import {Router} from '@angular/router';
import {SettingsService} from '../settings.service';
import {AuthService} from '../auth.service';
import {PasswordRepeat} from '../password-repeat';
import {environment} from '../../environments/environment';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  useAnimation
} from '@angular/animations';
import {fadeIn,fadeOut} from '../tableChangeAnim';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  animations:[
    trigger('overlay', [
      transition(':enter',[
        useAnimation(fadeIn),
      ]),
      transition(':leave',[
        useAnimation(fadeOut),
      ]),
    ]),
    trigger('changeSection',[
      transition(':enter',[
        style({
          opacity: 0,
          transform: "translateY(-20px)",
        }),
        animate('.3s ease-out',style({
          opacity:1,
          transform: "translateY(0px)",
        })),
      ]),
    ]),
  ]
})
export class SettingsComponent implements OnInit {
  openDeleteAccount = false;
  deleteAccountLoading = false;
  fileAvatar;
  avatarPreview = '../../assets/Images/default-avatar.png';
  accountInfo;
  loading = false;
  success = false;
  error = '';
  oldPasswordHide = true;
  newPasswordHide = true;
  repeat_newPasswordHide = true;
  informationForm = new FormGroup({
    name: new FormControl('',[
      Validators.required,
    ]),
    email: new FormControl('',[
      Validators.required,
      Validators.email,
    ]),
  });
  passwordForm = new FormGroup({
    oldPassword: new FormControl('',[
      Validators.required,
    ]),
    newPassword: new FormControl('',[
      Validators.required,
      Validators.pattern("^(.*)(?=.*[a-z]+)(?=.*[A-Z]{1,})(?=.*\\d{2,}).*"),
    ]),
    repeat_newPassword: new FormControl('',[
      Validators.required,
      this.repeatPassword.newPasswordValidator,
    ]),
  });
  currentSection = 'informazioni';
  constructor(private settings:SettingsService, private auth:AuthService, private repeatPassword:PasswordRepeat,private router:Router ) {
    this.passwordForm.get('newPassword').valueChanges.subscribe((val)=>{
      this.passwordForm.get('repeat_newPassword').updateValueAndValidity();
    });
  }
  ngOnInit(): void {
    this.getAccountInformation();
  }
  getAccountInformation(){
    this.auth.getAccountInfo().subscribe((res)=>{
      this.accountInfo = res;
      if(this.accountInfo.avatar.length > 0){
        this.avatarPreview = environment.image  + this.accountInfo.avatar;
      }
      this.informationForm.get('name').setValue(this.accountInfo.username);
      this.informationForm.get('email').setValue(this.accountInfo.email);
    },err=>{
    });
  }
  updateInformation(){
    if(this.loading == true || this.informationForm.valid != true){
      return;
    }
    this.loading = true;
    this.success = false;
    this.error = '';
    let data = {
      username: this.informationForm.value.name,
      email: this.informationForm.value.email,
    }
    this.settings.updateInformation(data).subscribe((res)=>{
      this.loading = false;
      this.success = true;
      this.settings.updateNavInfo();
    },err=>{
      console.log(err);
      if(err.error.errors.unique != undefined){
        this.error = err.error.errors.unique;
        this.loading = false;
        return;
      }
      this.error = "C'è stato un errore";
      this.loading = false;
    });
  }
  changeSection(section){
    if(this.loading == true){
      return;
    }
    this.currentSection = section;
    this.success = false;
    this.error = '';
  }
  updatePassword(){
    if(this.loading == true || this.passwordForm.valid != true){
      return;
    }
    this.error = '';
    this.success = false;
    this.loading = true;
    let data = {
      oldPassword: this.passwordForm.value.oldPassword,
      newPassword: this.passwordForm.value.newPassword,
    }
    this.settings.updatePassword(data).subscribe((res)=>{

      this.success = true;
      this.loading = false;
    },err=>{
      if(err.error.errors.oldPassword == undefined){
        this.loading = false;
        return;
      }
      this.loading = false;
      this.error = err.error.errors.oldPassword;
    });
  }
  avatarChange($event){
    this.error = '';
    this.success = false;
    let regex = new RegExp("\/(gif|jpe?g|png|webp|bmp)");
    let e:any = event;
    let file = e.srcElement.files[0];
    if(file == undefined){
      return;
    }
    if((file.size/1024)/1024 < 200 == false){
      this.error = 'Il file è troppo grande';
      return;
    }
    if(!regex.exec(file.type)){
      this.error = 'Il formato non è valido';
      return;
    }
    this.fileAvatar = file;
    let fileReader = new FileReader();
    fileReader.onloadend = (data:any)=>{
      this.avatarPreview = data.currentTarget.result;
    }
    fileReader.readAsDataURL(file);
  }
  updateAvatar(){
    if(this.fileAvatar == undefined || this.loading == true){
      return;
    }
    this.error ='';
    this.success = false;
    this.loading = true;
    this.settings.updateAvatar(this.fileAvatar).subscribe((res:any)=>{
      this.success = true;
      this.loading = false;
      let newAvatar = res.avatar;
      this.settings.updateNavInfo();
    },err=>{
      this.error = "C'è stato un errore";
      this.loading = false;
    });
  }
  deleteAvatar(){
    if(this.loading == true){
      return;
    }
    this.loading = true;
    this.settings.deleteAvatar().subscribe((res)=>{
      this.loading = false;
      this.avatarPreview = '../../assets/Images/default-avatar.png';
      this.settings.updateNavInfo();
    },err=>{
      console.log('errore!');
    });
  }
  deleteAccount(){
    if(this.deleteAccountLoading == true){
      return;
    }
    this.deleteAccountLoading = true;
    this.auth.deleteAccount().subscribe((res)=>{
      this.deleteAccountLoading = false;
      this.auth.logout();
      this.auth.changeLoggedState(false);
      this.router.navigate(['home']);
    },err=>{
      console.log('errore!');
    });
  }
}
