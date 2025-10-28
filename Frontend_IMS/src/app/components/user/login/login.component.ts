import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthRequestDTO } from '../../../models/auth-request.model';
import { AuthService } from '../../../service/auth.service';
import { CommonModule } from '@angular/common';
import {jwtDecode} from 'jwt-decode';

interface JwtPayload {
  sub: string;
  role: string;
  iat: number;
  exp: number;
}

@Component({
  selector: 'login',
  standalone: true,
  imports:[FormsModule, RouterModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls:['./login.component.css']
})
export class LoginComponent {

  loginData: AuthRequestDTO = { email: '', password: '' };
  errorMsg: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(form: NgForm) {
    if (form.invalid) return;

    this.authService.login(this.loginData).subscribe({
      next: (res) => {
        console.log('Login successful:', res.token);

        this.authService.saveToken(res.token);

        // Decode JWT to get role
        const decoded = jwtDecode<JwtPayload>(res.token);
        const role = decoded.role.toUpperCase(); // e.g., "ROLE_ADMIN"

         localStorage.setItem('role', role);
         console.log(role);

        if (role === 'ROLE_ADMIN') {
          this.router.navigate(['/admin-dashboard']);
        } else if (role === 'ROLE_MANAGER') {
          this.router.navigate(['/manager-dashboard']);
        } else if (role === 'ROLE_STAFF') {
          this.router.navigate(['/staff-dashboard']);
        } else {
          this.router.navigate(['/']); // fallback
        }
      },
      error: (err) => {
        this.errorMsg = err.error || 'Login failed. Please try again.';
      }
    });
  }
}
