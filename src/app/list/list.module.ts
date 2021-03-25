import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListRoutingModule } from './list-routing.module';
import { ListComponent } from './list.component';
import {ListNavComponent} from '../list-nav/list-nav.component';
import { MatIconModule } from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {FilmListUpdateComponent} from '../film-list-update/film-list-update.component';
import {MatSelectModule} from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';




@NgModule({
  declarations: [ListComponent,ListNavComponent,FilmListUpdateComponent],
  imports: [
    CommonModule,
    ListRoutingModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule
  ]
})
export class ListModule { }
