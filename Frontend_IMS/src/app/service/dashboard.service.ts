import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private baseUrl = 'http://localhost:8080/api';
  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Combine multiple GET requests and return counts
  getCounts(): Observable<any> {
    const headers = this.getAuthHeaders();

    const suppliers$ = this.http.get<any[]>(`${this.baseUrl}/suppliers`, { headers });
    const productSuppliers$ = this.http.get<any[]>(`${this.baseUrl}/product-suppliers`, { headers });
    const transactions$ = this.http.get<any[]>(`${this.baseUrl}/transactions`, { headers });

    // Combine all 3 responses into one observable
    return forkJoin({ suppliers$, productSuppliers$, transactions$ });
  }
}
