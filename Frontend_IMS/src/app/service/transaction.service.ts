import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TransactionDTO } from '../models/transaction.model';
import { TransactionRequestDTO } from '../models/transaction-request.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  private baseUrl = 'http://localhost:8080/api/transactions';

  constructor(private http: HttpClient) {}

  // 🔐 Include JWT token in headers
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // 🛒 Purchase Product (POST) — only MANAGER
  purchaseProduct(request: TransactionRequestDTO): Observable<TransactionDTO> {
    return this.http.post<TransactionDTO>(`${this.baseUrl}/purchase`, request, {
      headers: this.getAuthHeaders()
    });
  }

  // 💰 Sell Product (POST) — MANAGER & STAFF
  sellProduct(request: TransactionRequestDTO): Observable<TransactionDTO> {
    return this.http.post<TransactionDTO>(`${this.baseUrl}/sale`, request, {
      headers: this.getAuthHeaders()
    });
  }

  // 🔍 Get Transaction by ID (GET) — MANAGER & ADMIN
  getTransactionById(id: number): Observable<TransactionDTO> {
    return this.http.get<TransactionDTO>(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // 📋 Get All Transactions (GET) — MANAGER & ADMIN
  getAllTransactions(): Observable<TransactionDTO[]> {
    return this.http.get<TransactionDTO[]>(this.baseUrl, {
      headers: this.getAuthHeaders()
    });
  }

  // ❌ Delete Transaction (DELETE) — only ADMIN
  deleteTransaction(id: number): Observable<string> {
    return this.http.delete(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders(),
      responseType: 'text'
    });
  }
}
