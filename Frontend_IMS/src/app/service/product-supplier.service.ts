import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ProductSupplierDTO } from '../models/product-supplier.model';
import { ProductSupplierRequestDTO } from '../models/product-supplier-request.model';


@Injectable({
  providedIn: 'root'
})
export class ProductSupplierService {

  private baseUrl = `http://${window.location.hostname}:8080/api/product-suppliers`;

  constructor(private http: HttpClient) {}

  // 🔐 Include JWT token in headers
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // JWT token stored after login
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // ➕ Create Product-Supplier Relation (POST)
  createProductSupplier(request: ProductSupplierRequestDTO): Observable<ProductSupplierDTO> {
    return this.http.post<ProductSupplierDTO>(this.baseUrl, request, {
      headers: this.getAuthHeaders()
    });
  }

  // 📋 Get All Product-Suppliers (GET)
  getAllProductSuppliers(): Observable<ProductSupplierDTO[]> {
    return this.http.get<ProductSupplierDTO[]>(this.baseUrl, {
      headers: this.getAuthHeaders()
    });
  }


  getProductSupplierById(id: number): Observable<ProductSupplierDTO> {
    return this.http.get<ProductSupplierDTO>(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  
  updateProductSupplier(id: number, request: ProductSupplierRequestDTO): Observable<ProductSupplierDTO> {
    return this.http.put<ProductSupplierDTO>(`${this.baseUrl}/${id}`, request, {
      headers: this.getAuthHeaders()
    });
  }

  
  deleteProductSupplier(id: number): Observable<string> {
    return this.http.delete(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders(),
      responseType: 'text' // backend returns plain text message
    });
  }
}
