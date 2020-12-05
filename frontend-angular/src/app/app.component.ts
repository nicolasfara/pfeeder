import { Component } from '@angular/core';
import { AuthService } from './shared/service/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend-angular';
  constructor(public authService: AuthService) { }

  logout() {
    this.authService.doLogout();
  }

}
