import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminAreaRoutingModule } from './admin-area-routing.module';
import { AdminAreaComponent } from './admin-area.component';
import { NgScrollbarModule } from 'ngx-scrollbar';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatTableModule} from '@angular/material/table';

@NgModule({
  declarations: [AdminAreaComponent],
  imports: [
    CommonModule,
    AdminAreaRoutingModule,
    NgScrollbarModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule
  ]
})
export class AdminAreaModule { }
