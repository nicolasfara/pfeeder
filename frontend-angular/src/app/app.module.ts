import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts';
import { AppComponent } from './app.component';
import { HomepageComponent } from './homepage/homepage.component';
import { LoginComponent } from './login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { RegisterComponent } from './register/register.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './shared/service/auth/authconfig.interceptor';
import {ReactiveFormsModule} from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SidenavbarComponent } from './sidenavbar/sidenavbar.component';
import { AddpetComponent } from './addpet/addpet.component';
import { TopbarComponent } from './topbar/topbar.component';
import { AddrationComponent } from './addration/addration.component';
import { ProfileComponent } from './profile/profile.component';
import { DoughnutComponent } from './doughnut/doughnut.component';
@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    LoginComponent,
    RegisterComponent,
    NavbarComponent,
    DashboardComponent,
    SidenavbarComponent,
    AddpetComponent,
    TopbarComponent,
    AddrationComponent,
    ProfileComponent,
    DoughnutComponent
  ],
  imports: [
    BrowserModule,
    // import HttpClientModule after BrowserModule.
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    ChartsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
