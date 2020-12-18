import { NgModule } from '@angular/core';
// Required services for navigation
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
// Import all the components for which navigation service has to be activated

import {HomepageComponent} from './_component/home/homepage/homepage.component';
import {LoginComponent} from './_component/userComponent/login/login.component';
import {RegisterComponent} from './_component/userComponent/register/register.component';
import {DashboardComponent} from "./_component/mainDashboard/dashboard/dashboard.component";
import {AddpetComponent} from "./_component/pet/addpet/addpet.component";
import {ProfileComponent} from "./_component/userComponent/profile/profile.component";
import {NotfoundComponent} from "./_component/userComponent/notfound/notfound.component";

const routes: Routes = [
  { path: '', redirectTo: '/homepage', pathMatch: 'full' },
  { path: 'homepage', component: HomepageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'addpet', component: AddpetComponent },
  { path: 'profile', component : ProfileComponent},
  { path: '**', component: NotfoundComponent} // If no matching route found, go back to home route
  // add  { path: 'user-profile/:id', component: UserProfileComponent, canActivate: [AuthGuard] } for dashboard
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
