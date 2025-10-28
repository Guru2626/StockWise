import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { RegisterRequestDTO } from '../../../models/register-request.model';
import { AuthService } from '../../../service/auth.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'sign-up',
  standalone : true,
  imports:[FormsModule, RouterModule, CommonModule],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {

  // Model for form
  registerData: RegisterRequestDTO = {
    userName: '',
    email: '',
    password: ''
  };

  message: string = '';
  isError: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  // Form submit handler
  onSubmit(form: NgForm) {
    if (form.invalid) return;

    this.authService.register(this.registerData).subscribe({
      next: (res) => {
        this.message = 'Registered successfully! Redirecting to login...';
        this.isError = false;
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
  // Handle error responses properly
  if (err.error && typeof err.error === 'object') {
    // Try to extract a message from the object (commonly `message` or `error`)
    this.message = err.error.message || err.error.error || 'Registration failed. Try again.';
  } else {
    // If it’s just a string or something else
    this.message = err.error || 'Registration failed. Try again.';
  }
  this.isError = true;
}

    });
  }
}
