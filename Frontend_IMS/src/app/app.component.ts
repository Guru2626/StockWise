import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ManagerDashboardComponent } from './components/dashboard/manager-dashboard/manager-dashboard.component';
import { LoginComponent } from './components/user/login/login.component';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ManagerDashboardComponent, LoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ims-frontend';
}
