import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminFilmRoutingModule } from './admin-film-routing.module';
import { AdminFilmComponent } from './admin-film.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatDatepickerModule} from '@angular/material/datepicker';


@NgModule({
  declarations: [AdminFilmComponent],
  imports: [
    CommonModule,
    AdminFilmRoutingModule,
    MatPaginatorModule,
    MatDatepickerModule
  ]
})
export class AdminFilmModule { }
