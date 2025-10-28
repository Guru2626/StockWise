import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductService } from '../../../service/product.service';
import { ProductDTO } from '../../../models/product.model';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../service/auth.service';
import { AdminService } from '../../../service/admin.service';

@Component({
  selector: 'staff-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './staff-dashboard.component.html',
  styleUrls: ['./staff-dashboard.component.css']
})
export class StaffDashboardComponent implements OnInit {

  products: ProductDTO[] = [];
  filteredProducts: ProductDTO[] = [];
  searchTerm = '';

  totalProducts = 0;
  inStock = 0;
  lowStock = 0;
  outOfStock = 0;
  totalStockValue = 0;
   userName: string = '';
  userEmail: string = '';
  userRole: string = '';
  showProfileModal = false;

  constructor(private productService: ProductService, private router: Router, private adminService: AdminService,
    private authService: AuthService) {}

  ngOnInit(): void {
    this.loadProducts();
    this.initializeUser();
  }

  // ✅ Load products from backend
  loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = data;
        this.calculateSummary(data);
      },
      error: (err) => console.error('Failed to load products:', err)
    });
  }

  initializeUser() {
    const userId = this.authService.getUserId();
    if (userId) {
      this.adminService.getUserById(userId).subscribe({
        next: (user) => {
          this.userName = user.userName || '';
          this.userEmail = user.email || '';
          this.userRole = user.roleName || '';
        },
        error: (err) => console.error('Error fetching user by ID:', err)
      });
    }
  }


  // ✅ Summary calculations
  calculateSummary(products: ProductDTO[]): void {
    this.totalProducts = products.length;
    this.totalStockValue = products.reduce((sum, p) => sum + (p.price * p.quantityInStock), 0);
    this.inStock = products.filter(p => p.quantityInStock > p.minStock).length;
    this.lowStock = products.filter(p => p.lowStock && p.quantityInStock > 0).length;
    this.outOfStock = products.filter(p => p.quantityInStock === 0).length;
  }

  // ✅ Status display logic
  getStatusText(p: ProductDTO): string {
    if (p.quantityInStock === 0) return 'Out of Stock';
    if (p.lowStock) return 'Low Stock';
    return 'In Stock';
  }

  getStatusClass(p: ProductDTO): string {
    if (p.quantityInStock === 0) return 'text-danger bg-danger bg-opacity-10 px-2 py-1 rounded';
    if (p.lowStock) return 'text-warning bg-warning bg-opacity-10 px-2 py-1 rounded';
    return 'text-success bg-success bg-opacity-10 px-2 py-1 rounded';
  }

  // ✅ Filter products by search term
  onSearchChange(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredProducts = this.products.filter(
      p =>
        p.productName.toLowerCase().includes(term) ||
        p.categoryName.toLowerCase().includes(term) ||
        p.supplierName.toLowerCase().includes(term)
    );
  }

  // ✅ Sell product
  


  goToSale(product: ProductDTO) {
     console.log('Navigating with product:', product);
  this.router.navigate(['/sale'], { state: { product } });
}


  goToCategories() {
    this.router.navigate(['/category-list']);
  }
  openProfile() {
    this.showProfileModal = true;
  }

  closeProfile() {
    this.showProfileModal = false;
  }
  logout() {
  this.authService.logout();  // Clear token and session
  this.closeProfile();        // Close profile modal
  this.router.navigate(['/login']);  // Redirect to login page
}

}
