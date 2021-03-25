import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FilmComponent } from './film.component';
import {FilmSinglePageComponent} from '../film-single-page/film-single-page.component';
import {FilmPageComponent} from '../film-page/film-page.component';
const routes: Routes = [
  { path: '', component: FilmComponent, children:[
    {path:'',component: FilmPageComponent},
    {path:'genere/:genre', component: FilmPageComponent},
    {path:'search/:query', component:FilmPageComponent},
  ]},
  {path:':filmId', component:FilmSinglePageComponent},



];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FilmRoutingModule { }
