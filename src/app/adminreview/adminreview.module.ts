import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminReviewRoutingModule } from './adminreview-routing.module';
import { AdminreviewComponent } from './adminreview.component';
import { NgScrollbarModule } from 'ngx-scrollbar';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatTableModule} from '@angular/material/table';
import { AdminreviewviewComponent } from '../adminreviewview/adminreviewview.component';
import { MatIconModule } from '@angular/material/icon';



@NgModule({
  declarations: [AdminreviewComponent,AdminreviewviewComponent],
  imports: [
    CommonModule,
    AdminReviewRoutingModule,
    NgScrollbarModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatIconModule
  ]
})
export class AdminReviewModule { }
