import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../../service/product.service';
import { ProductDTO } from '../../../models/product.model';
import { Location } from '@angular/common';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: ProductDTO[] = [];
  filteredProducts: ProductDTO[] = [];
  searchTerm: string = '';
  userRole = '';
  successMsg = '';
  errorMsg = '';

  constructor(
    private productService: ProductService,
    private router: Router,
    private location:Location
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.userRole = localStorage.getItem('role') || 'ROLE_MANAGER';
  }

  // Load all products
  loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = data;
      },
      error: (err) => {
        console.error('Error fetching products:', err);
        this.errorMsg = 'Failed to fetch products.';
      }
    });
  }

  // Search filter by product name
  onSearchChange(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredProducts = this.products.filter(
      p => p.productName.toLowerCase().includes(term)
    );
  }

  // Delete product (Manager only)
  deleteProduct(id: number): void {
    if (!confirm('Are you sure you want to delete this product?')) return;

    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.successMsg = 'Product deleted successfully!';
        this.errorMsg = '';
        this.loadProducts();
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = 'Failed to delete product.';
        this.successMsg = '';
      }
    });
  }

  // Navigate to Add Product Form
  navigateToAddProduct(): void {
    this.router.navigate(['/product-add']);
  }

  // Navigate to Update Product Form
  navigateToUpdateProduct(id: number): void {
    this.router.navigate(['/product-update', id]);
  }

  // Staff: Sell product action
  sellProduct(product: ProductDTO): void {
    alert(`Selling product: ${product.productName}`);
  }

  goBack(): void {
    this.location.back();
  }
}
