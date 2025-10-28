import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TransactionService } from '../../../service/transaction.service';
import { TransactionDTO } from '../../../models/transaction.model';
import { Location } from '@angular/common';

@Component({
  selector: 'transaction-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css']
})
export class TransactionListComponent implements OnInit {

  transactions: TransactionDTO[] = [];
  filteredTransactions: TransactionDTO[] = [];
  searchTerm: string = '';
  userRole = '';
  successMsg = '';
  errorMsg = '';

  constructor(
    private transactionService: TransactionService,
    private router: Router,
    private location:Location
  ) {}

  ngOnInit(): void {
    this.loadTransactions();
    this.userRole = localStorage.getItem('role') || 'ROLE_MANAGER';
  }

  // Load all transactions
  loadTransactions(): void {
    this.transactionService.getAllTransactions().subscribe({
      next: (data) => {
        this.transactions = data;
        this.filteredTransactions = data;
      },
      error: (err) => {
        console.error('Error fetching transactions:', err);
        this.errorMsg = 'Failed to fetch transactions.';
      }
    });
  }

  // Search filter by product name or user
  onSearchChange(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredTransactions = this.transactions.filter(
      t =>
        t.productName.toLowerCase().includes(term) ||
        t.userName.toLowerCase().includes(term)||
        t.transactionType.toLowerCase().includes(term)
    );
  }
   goBack(): void {
    this.location.back();
  }

}
