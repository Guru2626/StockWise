import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoryDTO } from '../models/category.model';
import { CategoryRequestDTO } from '../models/category-request.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {

  private baseUrl = 'http://localhost:8080/api/categories';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // JWT from login
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getAllCategories(): Observable<CategoryDTO[]> {
    return this.http.get<CategoryDTO[]>(this.baseUrl, { headers: this.getAuthHeaders() });
  }

  getCategoryById(id: number): Observable<CategoryDTO> {
    return this.http.get<CategoryDTO>(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  createCategory(category: CategoryRequestDTO): Observable<CategoryDTO> {
    return this.http.post<CategoryDTO>(this.baseUrl, category, { headers: this.getAuthHeaders() });
  }
// src/app/service/category.service.ts
deleteCategory(id: number): Observable<string> {
  return this.http.delete(`${this.baseUrl}/${id}`, {
    headers: this.getAuthHeaders(),
    responseType: 'text' // <- ensure we get the backend message as text
  });
}

}
