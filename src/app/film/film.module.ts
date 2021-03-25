import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilmRoutingModule } from './film-routing.module';
import { FilmComponent } from './film.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule,} from '@angular/material/input';




@NgModule({
  declarations: [FilmComponent],
  imports: [
    CommonModule,
    FilmRoutingModule,
    InfiniteScrollModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatInputModule
  ]
})
export class FilmModule { }
