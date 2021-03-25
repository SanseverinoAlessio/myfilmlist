import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminAreaComponent } from './admin-area.component';
import {AdminDashboardComponent} from '../admin-dashboard/admin-dashboard.component';
import {AdminuserComponent} from '../adminuser/adminuser.component';
import {AdminGuardService} from '../admin-guard.service';
import {AdminreviewComponent} from '../adminreview/adminreview.component';


const routes: Routes = [{
  path: '', component: AdminAreaComponent,canActivate:[AdminGuardService],children:[
    {path:'',redirectTo:'/admin/dashboard',pathMatch:'full'},
    {path:'dashboard',component: AdminDashboardComponent},
    { path: 'film', loadChildren: () => import('../admin-film/admin-film.module').then(m => m.AdminFilmModule) },
    { path: 'genre', loadChildren: () => import('../admin-genre/admin-genre.module').then(m => m.AdminGenreModule) },
    {path:'user', component:AdminuserComponent},
    { path: 'review', loadChildren: () => import('../adminreview/adminreview.module').then(m => m.AdminReviewModule) },
  ]}];

  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class AdminAreaRoutingModule { }
