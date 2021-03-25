import { Component, OnInit } from '@angular/core';
import { FormControl,FormGroup, Validators } from '@angular/forms';
import {Router,ActivatedRoute} from '@angular/router';
import {UserService} from '../user.service';
import {PasswordRepeat} from '../password-repeat';
import {Location} from '@angular/common';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
  animations:[ trigger('fadeIn', [
  transition(':enter',[
  style({
   opacity: 0,
   transform: "translateY(-20px)",
 }),
 animate('0.5s ease-out', style({
 opacity: 1,
 transform: "translateY(0px)",
})),
  ])
  ])
  ]
})
export class ResetPasswordComponent implements OnInit {
  resetForm = new FormGroup({
    email: new FormControl('',[
      Validators.required,
      Validators.email,
    ]),
  });
  resetPasswordForm = new FormGroup({
    newPassword: new FormControl('',[
      Validators.required,
      Validators.pattern("^(.*)(?=.*[a-z]+)(?=.*[A-Z]{1,})(?=.*\\d{2,}).*"),
    ]),
    repeatPassword: new FormControl('',[
      Validators.required,
      this.passwordRepeat.newPasswordValidator,
    ]),
  });
  tokenError = false;
  verifyTokenLoading = false
  passwordHide = true;
  repeatPasswordHide = true;
  loading = false;
  token;
  success = false;
  error = '';
  constructor(private user:UserService, private route:ActivatedRoute, private router:Router, private passwordRepeat:PasswordRepeat, private location:Location) {
    this.resetPasswordForm.get('newPassword').valueChanges.subscribe((val)=>{
      this.resetPasswordForm.get('repeatPassword').updateValueAndValidity();
    });
  }
  ngOnInit(): void {
    this.token = this.route.snapshot.params['token'];
    if(this.token != undefined){
    this.verifyTokenLoading = true;
    this.user.verifyPasswordToken(this.token).subscribe(()=>{
      this.verifyTokenLoading = false;
    },err=>{
        this.tokenError = true;
      this.verifyTokenLoading = false;
    });
    }
  }
  submit(){
    if(this.resetForm.valid != true || this.success == true || this.loading == true){
      return;
    }
    this.error = '';
    this.loading = true;
    let email = this.resetForm.value.email;
    this.user.sendResetPassword(email).subscribe((res)=>{
      this.success = true;
      this.loading = false;
    },err=>{
      this.error = "Email non trovata!";
      this.loading = false;
    });
  }
  submitNewPassword(){
    if(this.loading == true || this.success == true || this.resetPasswordForm.valid != true){
      return;
    }
    this.error = '';
    this.loading = true;
    let data = {
      token: this.token,
      newPassword: this.resetPasswordForm.value.newPassword,
    }
    this.user.resetPassword(data).subscribe((res)=>{
      this.loading = false;
      this.success = true;
    },err=>{
      if(err.status == 404){
        this.error = "La richiesta non esiste oppure è scaduta.";
      }
      this.loading = false;
    });
  }
  back(){
   this.location.back();
  }
}
