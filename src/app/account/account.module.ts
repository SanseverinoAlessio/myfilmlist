import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountRoutingModule } from './account-routing.module';
import { AccountComponent } from './account.component';
import {MatInputModule,} from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';




@NgModule({
  declarations: [AccountComponent],
  imports: [
    CommonModule,
    AccountRoutingModule,
    MatInputModule,
    MatIconModule

  ]
})
export class AccountModule { }
