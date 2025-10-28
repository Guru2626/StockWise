import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { TransactionService } from '../../../service/transaction.service';
import { TransactionRequestDTO } from '../../../models/transaction-request.model';
import { ProductDTO } from '../../../models/product.model';
import { Location } from '@angular/common';

@Component({
  selector: 'sale',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.css']
})
export class SaleComponent implements OnInit {

  saleRequest: TransactionRequestDTO = {
    productName: '',
    categoryName: '',
    supplierName: '',
    quantity: 0,
    price: 0
  };

  salePricePerUnit = 0;
  totalPrice = 0;
  successMsg = '';
  errorMsg = '';

  constructor(
    private transactionService: TransactionService,
    public router: Router,
    private location:Location
  ) {}

  ngOnInit(): void {
    // ✅ Get product details passed from Product List or Dashboard
    const state = history.state as { product?: ProductDTO };
    if (state && state.product) {
      const p = state.product;
      this.saleRequest.productName = p.productName;
      this.saleRequest.categoryName = p.categoryName;
      this.saleRequest.supplierName = p.supplierName;
      this.salePricePerUnit = p.price;
      this.saleRequest.price = p.price; // per unit
    }
  }

  // Auto calculate total sale amount
  updateTotalPrice() {
    this.totalPrice = this.saleRequest.quantity * this.salePricePerUnit;
  }

  // Submit sale transaction
  submitSale(form: NgForm): void {
    if (form.invalid || this.saleRequest.quantity <= 0) {
      this.errorMsg = '⚠️ Please enter a valid quantity.';
      return;
    }

    // Set final sale amount
    this.saleRequest.price = this.totalPrice;

    this.transactionService.sellProduct(this.saleRequest).subscribe({
      next: () => {
        this.successMsg = '✅ Sale completed successfully!';
        this.errorMsg = '';
        setTimeout(() => this.router.navigate(['/staff-dashboard']), 1500);
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = '❌ Failed to complete sale. Please try again.';
        this.successMsg = '';
      }
    });
  }
   goBack(): void {
    this.location.back();
  }
}
