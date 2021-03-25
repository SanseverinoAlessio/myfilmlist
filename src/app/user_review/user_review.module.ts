import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule,} from '@angular/material/input';
import {UserReviewRoutingModule} from './user_review-routing.module';
import {UserReviewComponent} from './user_review.component';
import {UserReviewsHeaderComponent} from '../user-reviews-header/user-reviews-header.component';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [UserReviewComponent,UserReviewsHeaderComponent],
  imports: [
    CommonModule,
    UserReviewRoutingModule,
    InfiniteScrollModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule
  ]
})
export class UserReviewModule { }
