import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminFilmComponent } from './admin-film.component';
import {CreatefilmComponent} from '../createfilm/createfilm.component';
import {AdminfilmpageComponent} from '../adminfilmpage/adminfilmpage.component';
const routes: Routes = [{ path: '', component: AdminFilmComponent,children:[
  {path: '',component:AdminfilmpageComponent},
  {path:'create',component:CreatefilmComponent,},
  {path:'update/:id',component:CreatefilmComponent},
  {path:'search/:query', component: AdminfilmpageComponent}
]}];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminFilmRoutingModule { }
