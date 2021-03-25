import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ListComponent} from './list.component';
import {ListPageComponent} from '../list_page/list-page.component';
const routes: Routes = [
  { path: '', component: ListComponent, children:[
    {path:'', redirectTo:'watched', pathMatch:'full'},
    {path:'watched',component: ListPageComponent},
    {path:'planned', component: ListPageComponent },
    {path:'incompleted', component:ListPageComponent },
    {path:'search/:query', component: ListPageComponent},
  ]},
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListRoutingModule { }
