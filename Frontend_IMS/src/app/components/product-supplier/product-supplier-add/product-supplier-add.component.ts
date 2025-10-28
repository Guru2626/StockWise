import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductSupplierService } from '../../../service/product-supplier.service';

import { SupplierService } from '../../../service/supplier.service';
import { CategoryService } from '../../../service/category.service';
import { SupplierDTO } from '../../../models/supplier.model';
import { CategoryDTO } from '../../../models/category.model';
import { ProductSupplierRequestDTO } from '../../../models/product-supplier-request.model';
import { Location } from '@angular/common';

@Component({
  selector: 'product-supplier-add',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-supplier-add.component.html',
  styleUrls: ['./product-supplier-add.component.css']
})
export class ProductSupplierAddComponent implements OnInit {
  newProductSupplier: ProductSupplierRequestDTO = {
    productName: '',
    categoryName: '',
    supplierName: '',
    supplyPrice: 0,
    leadTimeDays: 0
  };

  successMsg = '';
  errorMsg = '';

  categories: CategoryDTO[] = [];
  suppliers: SupplierDTO[] = [];

  constructor(
    private productSupplierService: ProductSupplierService,
    private categoryService: CategoryService,
    private supplierService: SupplierService,
    public router: Router,
    private location:Location
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadSuppliers();
  }

  // Fetch all categories
  loadCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (data) => (this.categories = data),
      error: (err) => console.error('Error loading categories:', err)
    });
  }

  // Fetch all suppliers
  loadSuppliers() {
    this.supplierService.getAllSuppliers().subscribe({
      next: (data) => (this.suppliers = data),
      error: (err) => console.error('Error loading suppliers:', err)
    });
  }

  // Add Product-Supplier
  addProductSupplier(form: NgForm) {
    if (form.invalid) {
      this.errorMsg = 'Please fill all required fields correctly.';
      return;
    }

    this.productSupplierService.createProductSupplier(this.newProductSupplier).subscribe({
      next: () => {
        this.successMsg = '✅ Product-Supplier added successfully!';
        setTimeout(() => this.router.navigate(['/product-suppliers']), 1500);
        form.resetForm();
      },
      error: () => {
        this.errorMsg = '❌ Failed to add Product-Supplier. Please try again.';
      }
    });
  }
  goBack(): void {
    this.location.back();
  }
}
