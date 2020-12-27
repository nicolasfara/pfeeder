import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {HomepageComponent} from './_component/home/homepage/homepage.component';
import {LoginComponent} from './_component/user/login/login.component';
import {RegisterComponent} from './_component/user/register/register.component';
import {DashboardComponent} from './_component/main/dashboard/dashboard.component';
import {AddpetComponent} from './_component/pet/addpet/addpet.component';
import {ProfileComponent} from './_component/user/profile/profile.component';
import {NotfoundComponent} from './_component/user/notfound/notfound.component';
import {AuthGuard} from './_services/auth/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/homepage', pathMatch: 'full' },
  { path: 'homepage', component: HomepageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'addpet', component: AddpetComponent, canActivate: [AuthGuard] },
  { path: 'profile', component : ProfileComponent, canActivate: [AuthGuard]},
  { path: '**', component: NotfoundComponent} // If no matching route found, go back to home route
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [RouterModule]
})

export class AppRoutingModule { }
