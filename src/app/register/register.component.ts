import { Component, OnInit } from '@angular/core';
import { FormControl,FormGroup, Validators } from '@angular/forms';
import {PasswordRepeat} from '../password-repeat';
import {UserService} from '../user.service';
import {Router} from '@angular/router';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
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
export class RegisterComponent implements OnInit {
  registerForm;
  completed:boolean = false;
  loading:boolean = false;
  passwordHide = true;
  password_RepeatHide = true;
  constructor(private passwordRepeat:PasswordRepeat, private user:UserService, private router:Router ) {
  }
  ngOnInit(): void {
    this.registerForm  = new FormGroup({
      username: new FormControl('',[
        Validators.required,
        Validators.maxLength(14),
        Validators.minLength(3),
      ]),
      email: new FormControl('',[
        Validators.required,
        Validators.email,
      ],
      [
        this.user.uniqueEmail(),
      ],
    ),
    password: new FormControl('',[
      Validators.required,
      Validators.pattern("^(.*)(?=.*[a-z]+)(?=.*[A-Z]{1,})(?=.*\\d{2,}).*"),
    ]),
    repeat_password: new FormControl('',[
      Validators.required,
      this.passwordRepeat.verify,
    ])
  });
  this.registerForm.get('password').valueChanges.subscribe((val)=>{
    this.registerForm.get('repeat_password').updateValueAndValidity();
  });
}
formIsValid(){
  return this.registerForm.valid == true ? true : false;
}
resetForm(){
  this.registerForm.reset();
  this.registerForm.setErrors(null);
  this.registerForm.updateValueAndValidity();

}
submit(){
  if(this.registerForm.valid != true || this.completed == true || this.loading == true){
    return;
  }
  this.loading = true;
  let data = {
    username: this.registerForm.value.username,
    email: this.registerForm.value.email,
    password: this.registerForm.value.password
  };
  this.user.register(data).subscribe((val)=>{
    this.completed = true;
    this.loading = false;
    this.resetForm();
    setTimeout(() => {
      this.router.navigate(['/account/login']);
    }, 800);
  });
}
}
