import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminGenreRoutingModule } from './admin-genre-routing.module';
import { AdminGenreComponent } from './admin-genre.component';


@NgModule({
  declarations: [AdminGenreComponent],
  imports: [
    CommonModule,
    AdminGenreRoutingModule
  ]
})
export class AdminGenreModule { }
