import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Injectable } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class PasswordRepeat {
  constructor(){
  }
  verify(control: AbstractControl) : {[key: string]: any} | null {
    if(control.value){
      let password = control.root.get('password').value;
      return control.value == password ? null : {PasswordRepeat:{value:control.value} };
    }
  }
  newPasswordValidator(control:AbstractControl):{[key:string]:any} | null {
    if(control.value){
      let password = control.root.get('newPassword').value;
      return control.value == password ? null : {passwordRepeat:{value:control.value}};
    }
  }
}
