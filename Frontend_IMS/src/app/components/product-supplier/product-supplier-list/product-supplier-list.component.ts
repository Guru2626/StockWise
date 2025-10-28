import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductSupplierService } from '../../../service/product-supplier.service';
import { ProductSupplierDTO } from '../../../models/product-supplier.model';
import { Location } from '@angular/common';

@Component({
  selector: 'product-supplier-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-supplier-list.component.html',
  styleUrls: ['./product-supplier-list.component.css']
})
export class ProductSupplierListComponent implements OnInit {

  productSuppliers: ProductSupplierDTO[] = [];
  filteredProductSuppliers: ProductSupplierDTO[] = []; // For filtered results
  searchTerm: string = ''; // For the search input
  successMsg = '';
  errorMsg = '';
  userRole = '';

  constructor(
    private productSupplierService: ProductSupplierService,
    public router: Router,
    private location:Location
  ) {}

  ngOnInit(): void {
    this.loadProductSuppliers();
    this.userRole = localStorage.getItem('role') || 'ROLE_ADMIN';
  }

  // Load all product-supplier data
  loadProductSuppliers() {
    this.productSupplierService.getAllProductSuppliers().subscribe({
      next: (data) => {
        this.productSuppliers = data;
        this.filteredProductSuppliers = data; // Initially show all
      },
      error: (err) => console.error('Error fetching product-suppliers:', err)
    });
  }

  // Search filter by product name
  onSearchChange() {
    const term = this.searchTerm.toLowerCase();
    this.filteredProductSuppliers = this.productSuppliers.filter(ps =>
      ps.productName.toLowerCase().includes(term)
    );
  }

  // Delete product-supplier (Admin only)
  deleteProductSupplier(id: number) {
    if (!confirm('Are you sure you want to delete this product-supplier record?')) return;

    this.productSupplierService.deleteProductSupplier(id).subscribe({
      next: () => {
        this.successMsg = 'Product-Supplier deleted successfully!';
        this.errorMsg = '';
        this.loadProductSuppliers();
      },
      error: (err) => {
        this.errorMsg = 'Failed to delete product-supplier';
        this.successMsg = '';
        console.error(err);
      }
    });
  }




  // Navigate to Add Product-Supplier form
  navigateToAddProductSupplier() {
    this.router.navigate(['/product-supplier-add']);
  }

  // Navigate to Update Product-Supplier form
  navigateToUpdateProductSupplier(id: number) {
    this.router.navigate(['/product-supplier-update', id]);
  }

  // For MANAGER role: Purchase button
 // Manager Action
navigateTopurchaseProduct(ps: ProductSupplierDTO) {
  this.router.navigate(['/purchase'], { state: { productSupplier: ps } });
}
goBack(): void {
    this.location.back();
  }

}
