import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AdmingenrepageComponent} from '../admingenrepage/admingenrepage.component';
import { AdminGenreComponent } from './admin-genre.component';
import {CreateGenreComponent} from '../create-genre/create-genre.component';
const routes: Routes = [{ path: '', component: AdminGenreComponent,children:[
  {path:'', component:AdmingenrepageComponent },
  {path:'create',component: CreateGenreComponent },
  {path:'update/:id',component:CreateGenreComponent}
]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminGenreRoutingModule { }
