import { Component, OnInit } from '@angular/core';
import { FormControl,FormGroup, Validators } from '@angular/forms';
import {UserService} from '../user.service';
import {AuthService} from '../auth.service';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
   trigger('fadeIn', [
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
export class LoginComponent implements OnInit {
  passwordHide:boolean = true;
  loginForm:any;
  error:boolean = false;
  completed:boolean = false;
  loading:boolean = false;
  constructor(private user:UserService, private router:Router, private auth:AuthService) {
    this.loginForm = new FormGroup({
      email: new FormControl('',[
        Validators.required,
      ]),
      password: new FormControl('',[
        Validators.required,
      ])
    });
  }
  ngOnInit(): void {
  }
  formIsValid(){
    return this.loginForm.valid == true ? true : false;
  }
  submit(){
    if(this.loginForm.valid != true || this.completed == true){
      return;
    }
    this.loading = true;
    let data = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };
    this.user.login(data).subscribe((res:any)=>{
      if(!res.logged == true){
        this.error = true;
        return;
      }
      this.error = false;
      this.loading = false;
      this.completed = true;
      let token = res.token;
      localStorage.setItem('token',token);
      setTimeout(() => {
        this.auth.changeLoggedState(true);
        this.router.navigate(['/film']);
      }, 1000);
    }, (err:any)=>{
      this.error = true;
      this.loading = false;
    });
  }
}
