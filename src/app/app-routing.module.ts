import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {Page404Component} from './page404/page404.component';
const routes: Routes = [
  {path:'home',component: HomeComponent},
  {path:'',redirectTo:'/home',pathMatch:"full"},
  {path:"account",loadChildren: ()=> import('./account/account.module').then(m=>m.AccountModule)},
  { path: 'film', loadChildren: () => import('./film/film.module').then(m => m.FilmModule) },
  {path:"film",loadChildren: ()=> import('./film/film.module').then(m=>m.FilmModule)},
  { path: 'admin', loadChildren: () => import('./admin-area/admin-area.module').then(m => m.AdminAreaModule) },
  {path:'404', component: Page404Component},
  { path: 'adminGenre', loadChildren: () => import('./admin-genre/admin-genre.module').then(m => m.AdminGenreModule) },
  {path: "**", redirectTo:'/home', pathMatch:'full'},
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
