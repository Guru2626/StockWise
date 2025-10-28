import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { TransactionService } from '../../../service/transaction.service';
import { CategoryService } from '../../../service/category.service';
import { SupplierService } from '../../../service/supplier.service';
import { CategoryDTO } from '../../../models/category.model';
import { SupplierDTO } from '../../../models/supplier.model';
import { TransactionRequestDTO } from '../../../models/transaction-request.model';
import { ProductSupplierDTO } from '../../../models/product-supplier.model';
import { Location } from '@angular/common';

@Component({
  selector: 'purchase',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.css']
})
export class PurchaseComponent implements OnInit {

  purchaseRequest: TransactionRequestDTO = {
    productName: '',
    categoryName: '',
    supplierName: '',
    quantity: 0,
    price: 0
  };

  supplyPricePerUnit = 0; // To store per-unit price
  totalPrice = 0;

  successMsg = '';
  errorMsg = '';

  constructor(
    private transactionService: TransactionService,
    private categoryService: CategoryService,
    private supplierService: SupplierService,
    public router: Router,
    private location:Location
  ) {}

  ngOnInit(): void {
    // ✅ Get product-supplier details passed from previous page
    const state = history.state as { productSupplier?: ProductSupplierDTO };
    if (state && state.productSupplier) {
      const ps = state.productSupplier;
      this.purchaseRequest.productName = ps.productName;
      this.purchaseRequest.categoryName = ps.categoryName;
      this.purchaseRequest.supplierName = ps.supplierName;
      this.supplyPricePerUnit = ps.supplyPrice;
      this.purchaseRequest.price = ps.supplyPrice; // per unit price
    }
  }

  // When quantity changes, auto-calculate total price
  updateTotalPrice() {
    this.totalPrice = this.purchaseRequest.quantity * this.supplyPricePerUnit;
  }

  // Submit purchase transaction
  submitPurchase(form: NgForm): void {
    if (form.invalid) {
      this.errorMsg = '⚠️ Please fill all fields correctly before submitting.';
      return;
    }

    // Set final total price
    this.purchaseRequest.price = this.totalPrice;

    this.transactionService.purchaseProduct(this.purchaseRequest).subscribe({
      next: () => {
        this.successMsg = '✅ Product purchased successfully!';
        this.errorMsg = '';
        setTimeout(() => this.router.navigate(['/manager-dashboard']), 1500);
        
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = '❌ Failed to complete purchase. Please try again.';
        this.successMsg = '';
      }
    });
  }
  goBack(): void {
    this.location.back();
  }
}
