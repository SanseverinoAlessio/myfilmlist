import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NavigationComponent } from './navigation/navigation.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CommonModule } from '@angular/common';
import { SwiperModule } from 'swiper/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatInputModule,} from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {ErrorStateMatcher,ShowOnDirtyErrorStateMatcher} from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { ListComponent } from './list/list.component';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {TokenInterceptorService} from './token-interceptor.service';
import { ListPageComponent } from './list_page/list-page.component';
import { LogoutComponent } from './logout/logout.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { FilmSinglePageComponent } from './film-single-page/film-single-page.component';
import { Page404Component } from './page404/page404.component';
import { FilmPageComponent } from './film-page/film-page.component';
import {MatSelectModule} from '@angular/material/select';
import { ReviewComponent } from './review/review.component';
import { SettingsComponent } from './settings/settings.component';
import { UserReviewPageComponent } from './user-review-page/user-review-page.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { CreatefilmComponent } from './createfilm/createfilm.component';
import { AdminfilmpageComponent } from './adminfilmpage/adminfilmpage.component';
import { MatTableModule } from '@angular/material/table'
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatMenuModule} from '@angular/material/menu';
import { AdmingenrepageComponent } from './admingenrepage/admingenrepage.component';
import { CreateGenreComponent } from './create-genre/create-genre.component';
import { AdminuserComponent } from './adminuser/adminuser.component';
import { AdminreviewComponent } from './adminreview/adminreview.component';
import { AdminreviewpageComponent } from './adminreviewpage/adminreviewpage.component';
import { DropdownDirective } from './dropdown.directive';
import {MatTabsModule} from '@angular/material/tabs';
import { ConfirmComponent } from './confirm/confirm.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ResetPasswordComponent } from './reset-password/reset-password.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavigationComponent,
    LoginComponent,
    RegisterComponent,
    ListPageComponent,
    LogoutComponent,
    FilmSinglePageComponent,
    Page404Component,
    FilmPageComponent,
    ReviewComponent,
    SettingsComponent,
    UserReviewPageComponent,
    AdminDashboardComponent,
    CreatefilmComponent,
    AdminfilmpageComponent,
    AdmingenrepageComponent,
    CreateGenreComponent,
    AdminuserComponent,
    AdminreviewpageComponent,
    DropdownDirective,
    ConfirmComponent,
    ResetPasswordComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    SwiperModule,
    BrowserAnimationsModule,
    MatInputModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    MatIconModule,
    InfiniteScrollModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatMenuModule,
    MatTabsModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [
    {provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher},
    {provide:HTTP_INTERCEPTORS,useClass:TokenInterceptorService,multi:true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
