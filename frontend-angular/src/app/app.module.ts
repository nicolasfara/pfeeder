import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {ChartsModule} from 'ng2-charts';
import {AppComponent} from './app.component';
import {HomepageComponent} from './_component/home/homepage/homepage.component';
import {LoginComponent} from './_component/user/login/login.component';
import {AppRoutingModule} from './app-routing.module';
import {RegisterComponent} from './_component/user/register/register.component';
import {NavbarComponent} from './_component/home/navbar/navbar.component';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthInterceptor} from './_services/auth/authconfig.interceptor';
import {ReactiveFormsModule} from '@angular/forms';
import {DashboardComponent} from './_component/main/dashboard/dashboard.component';
import {SidenavbarComponent} from './_component/main/sidenavbar/sidenavbar.component';
import {AddpetComponent} from './_component/pet/addpet/addpet.component';
import {TopbarComponent} from './_component/main/topbar/topbar.component';
import {AddrationComponent} from './_component/ration/addration/addration.component';
import {ProfileComponent} from './_component/user/profile/profile.component';
import {DoughnutComponent} from './_component/main/doughnut/doughnut.component';
import {BarchartComponent} from './_component/main/barchart/barchart.component';
import {AddfodderComponent} from './_component/fodder/addfodder/addfodder.component';
import {LogoutComponent} from './_component/user/logout/logout.component';
import {NotfoundComponent} from './_component/user/notfound/notfound.component';
import {ShowfodderComponent} from './_component/fodder/showfodder/showfodder.component';
import {ShowpetComponent} from './_component/pet/showpet/showpet.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import {WebsocketService} from './_services/notification/websocket.service';
import { ShowrationComponent } from './_component/ration/showration/showration.component';
import { SwitchfodderComponent } from './_component/pet/switchfodder/switchfodder.component';

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
    DoughnutComponent,
    BarchartComponent,
    AddfodderComponent,
    LogoutComponent,
    NotfoundComponent,
    ShowfodderComponent,
    ShowpetComponent,
    ShowrationComponent,
    SwitchfodderComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    ChartsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }, WebsocketService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
