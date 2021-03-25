import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountComponent } from './account.component';
import {LoginComponent} from '../login/login.component';
import {RegisterComponent} from '../register/register.component';
import {ListComponent} from '../list/list.component';
import {AuthGuardService} from '../auth-guard.service';
import {IsloggedService} from '../islogged.service';
import {LogoutComponent} from '../logout/logout.component';
import {SettingsComponent} from '../settings/settings.component';
import {UserReviewPageComponent} from '../user-review-page/user-review-page.component';
import {ResetPasswordComponent} from '../reset-password/reset-password.component';
const routes: Routes = [
  { path: '', component: AccountComponent, children:[
    {path:'',redirectTo:"login",pathMatch:'full'},
    {path:"login", component: LoginComponent, canActivate:[IsloggedService]},
    {path:"register", component: RegisterComponent,canActivate:[IsloggedService]},
    {path: 'list', loadChildren: () => import('../list/list.module').then(m => m.ListModule), canActivate:[AuthGuardService]},
    {path:'logout', component: LogoutComponent,canActivate:[AuthGuardService]},
    {path:'settings',component:SettingsComponent,canActivate:[AuthGuardService]},
    {path:"reviews",loadChildren: ()=> import('../user_review/user_review.module').then(m=>m.UserReviewModule),canActivate:[AuthGuardService]},
    {path:"resetpassword",component:ResetPasswordComponent},
    {path:"resetpassword/:token",component:ResetPasswordComponent}
  ]
},
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
