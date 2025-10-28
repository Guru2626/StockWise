import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SupplierDTO } from '../models/supplier.model';
import { SupplierRequestDTO } from '../models/supplier-request.model';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  private baseUrl = 'http://localhost:8080/api/suppliers';

  constructor(private http: HttpClient) {}

  // 🔐 Include JWT token from localStorage in all requests
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // JWT token from login
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // ➕ Create Supplier (POST)
  createSupplier(supplier: SupplierRequestDTO): Observable<SupplierDTO> {
    return this.http.post<SupplierDTO>(this.baseUrl, supplier, {
      headers: this.getAuthHeaders()
    });
  }

  // 📋 Get All Suppliers (GET)
  getAllSuppliers(): Observable<SupplierDTO[]> {
    return this.http.get<SupplierDTO[]>(this.baseUrl, {
      headers: this.getAuthHeaders()
    });
  }

  // 🔍 Get Supplier by ID (GET /{id})
  getSupplierById(id: number): Observable<SupplierDTO> {
    return this.http.get<SupplierDTO>(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // ❌ Delete Supplier (DELETE /{id})
  deleteSupplier(id: number): Observable<string> {
    return this.http.delete(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders(),
      responseType: 'text' // backend returns plain text message
    });
  }
}
