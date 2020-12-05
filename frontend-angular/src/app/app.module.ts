import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {ChartsModule} from 'ng2-charts';
import {AppComponent} from './app.component';
import {HomepageComponent} from './homepage/homepage.component';
import {LoginComponent} from './login/login.component';
import {AppRoutingModule} from './app-routing.module';
import {RegisterComponent} from './register/register.component';
import {NavbarComponent} from './navbar/navbar.component';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthInterceptor} from './shared/service/auth/authconfig.interceptor';
import {ReactiveFormsModule} from '@angular/forms';
import {DashboardComponent} from './dashboard/dashboard.component';
import {SidenavbarComponent} from './sidenavbar/sidenavbar.component';
import {AddpetComponent} from './addpet/addpet.component';
import {TopbarComponent} from './topbar/topbar.component';
import {AddrationComponent} from './addration/addration.component';
import {ProfileComponent} from './profile/profile.component';
import {DoughnutComponent} from './doughnut/doughnut.component';
import {BarchartComponent} from './barchart/barchart.component';
import {AddfodderComponent} from './addfodder/addfodder.component';
import {AddfeedComponent} from './addfeed/addfeed.component';
import {LogoutComponent} from './logout/logout.component';
import {NotfoundComponent} from './notfound/notfound.component';
import {ForgotpasswordComponent} from './forgotpassword/forgotpassword.component';
import {ShowfodderComponent} from './showfodder/showfodder.component';
import {UpdatefodderComponent} from './updatefodder/updatefodder.component';
import {ShowpetComponent} from './showpet/showpet.component';
import {SocketIoModule, SocketIoConfig} from 'ngx-socket-io';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import {WebsocketService} from './websocket.service';

// const token = localStorage.getItem('access_token');
// const config: SocketIoConfig = {url: 'http://localhost:3000', options: {query: `auth_token=${token}`}};


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
    AddfeedComponent,
    LogoutComponent,
    NotfoundComponent,
    ForgotpasswordComponent,
    ShowfodderComponent,
    UpdatefodderComponent,
    ShowpetComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    ChartsModule,
    // /SocketIoModule.forRoot(config),
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
