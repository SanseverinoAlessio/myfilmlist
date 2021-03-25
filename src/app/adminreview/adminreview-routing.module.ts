import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AdminreviewpageComponent} from '../adminreviewpage/adminreviewpage.component';
import {AdminreviewComponent} from './adminreview.component';


const routes: Routes = [
  {path:'', component: AdminreviewComponent,children:[
  {path:'',component:AdminreviewpageComponent},


  ]}



];

  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class AdminReviewRoutingModule { }
