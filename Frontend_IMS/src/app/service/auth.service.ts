import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthRequestDTO } from '../models/auth-request.model';
import { AuthResponseDTO } from '../models/auth-response.model';
import { RegisterRequestDTO } from '../models/register-request.model';
import {jwtDecode} from 'jwt-decode';  // ✅ Correct import

// Interface for decoded JWT payload
export interface JwtPayload {
  sub: string;    // user's email
  role: string;   // user's role
  exp: number;
  userId?: number;    // expiration timestamp
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'http://localhost:8080/auth';

  constructor(private http: HttpClient) {}

  // Login API call
  login(request: AuthRequestDTO): Observable<AuthResponseDTO> {
    return this.http.post<AuthResponseDTO>(`${this.baseUrl}/login`, request);
  }

  // Register API call
  register(request: RegisterRequestDTO): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, request);
  }

  // Save JWT token in localStorage
  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  // Get JWT token from localStorage
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Remove JWT token (logout)
  logout() {
    localStorage.removeItem('token');
  }

  // Decode JWT to get payload
  private getDecodedToken(): JwtPayload | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      return jwtDecode<JwtPayload>(token);  // ✅ Works correctly at runtime
    } catch {
      return null;
    }
  }

  // Get the role of logged-in user
  getUserRole(): string | null {
    const decoded = this.getDecodedToken();
    return decoded?.role || null;
  }

  // Check if user is logged in and token is valid
  isLoggedIn(): boolean {
    const decoded = this.getDecodedToken();
    if (!decoded) return false;
    return decoded.exp * 1000 > Date.now();
  }

  // Get logged-in user's email
  getUserEmail(): string | null {
    const decoded = this.getDecodedToken();
    return decoded?.sub || null;
  }
  getUserId(): number | null {
  const decoded = this.getDecodedToken();
  if (!decoded) return null;
  return decoded.userId || null;
}
}
