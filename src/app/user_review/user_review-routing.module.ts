import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {UserReviewPageComponent} from '../user-review-page/user-review-page.component';
import {UserReviewComponent} from './user_review.component';
const routes: Routes = [
  {path:'',component:UserReviewComponent,children:[
    {path:'search/:query',component:UserReviewPageComponent},
    {path: '', component:UserReviewPageComponent},
  ]}
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserReviewRoutingModule { }
