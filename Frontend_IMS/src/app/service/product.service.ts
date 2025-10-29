import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductRequestDTO } from '../models/product-request.model';
import { ProductDTO } from '../models/product.model';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = `http://${window.location.hostname}:8080/api/products`;

  constructor(private http: HttpClient) {}

  // 🔐 Include JWT token in headers
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // ➕ Create Product (POST) - only MANAGER can do this
  createProduct(request: ProductRequestDTO): Observable<ProductDTO> {
    return this.http.post<ProductDTO>(this.baseUrl, request, {
      headers: this.getAuthHeaders()
    });
  }

  // ✏️ Update Product (PATCH) - only MANAGER can do this
  updateProduct(id: number, request: ProductRequestDTO): Observable<ProductDTO> {
    return this.http.patch<ProductDTO>(`${this.baseUrl}/${id}`, request, {
      headers: this.getAuthHeaders()
    });
  }

  // 📋 Get All Products (GET) - MANAGER + STAFF
  getAllProducts(): Observable<ProductDTO[]> {
    return this.http.get<ProductDTO[]>(this.baseUrl, {
      headers: this.getAuthHeaders()
    });
  }

  // 🔍 Get Product By ID (GET)
  getProductById(id: number): Observable<ProductDTO> {
    return this.http.get<ProductDTO>(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // ❌ Delete Product (DELETE) - only MANAGER
  deleteProduct(id: number): Observable<string> {
    return this.http.delete(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders(),
      responseType: 'text'
    });
  }
}
