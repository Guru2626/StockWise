import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../service/product.service';
import { ProductDTO } from '../../../models/product.model';
import { UserDTO } from '../../../models/user.model';
import { AdminService } from '../../../service/admin.service';
import { AuthService } from '../../../service/auth.service';
import { ProductRequestDTO } from '../../../models/product-request.model';

@Component({
  selector: 'manager-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manager-dashboard.component.html',
  styleUrls: ['./manager-dashboard.component.css']
})
export class ManagerDashboardComponent implements OnInit {

  products: ProductDTO[] = [];
  filteredProducts: ProductDTO[] = [];
  searchTerm = '';

  totalAssetValue = 0;
  inStock = 0;
  lowStock = 0;
  outOfStock = 0;

  currentPage: number = 1;
itemsPerPage: number = 5; // change as you want (5 or 10 items per page)
totalPages: number = 1;
paginatedProducts: any[] = [];
 userName: string = ''; // Default fallback
  userEmail: string = '';
  userRole: string = '';
  showProfileModal = false;
  selectedUser?: UserDTO;


  constructor(private productService: ProductService, private router: Router, private adminService: AdminService, private authService: AuthService  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this. initializeUser()
  }

  // ✅ Load products from backend
  loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = data;
        this.calculateSummary(data);
      },
      error: (err) => console.error('Error fetching products:', err)
    });
  }

initializeUser() {
  const userId = this.authService.getUserId();
  console.log('Decoded userId:', userId);
  if (userId) {
    this.adminService.getUserById(userId).subscribe({
      next: (user) => {
        console.log('User fetched by ID:', user);
        if (user) {
          this.userName = user.userName || '';
          this.userEmail = user.email || '';
          this.userRole = user.roleName || '';
          this.selectedUser = user;
        }
      },
      error: (err) => console.error('Error fetching user by ID:', err)
    });
  } else {
    console.warn('User ID not found in token');
  }
}


   openProfile() {
    this.showProfileModal = true;
  }
   closeProfile() {
    this.showProfileModal = false;
  }

  // ✅ Calculate summary values
  calculateSummary(products: ProductDTO[]): void {
    this.totalAssetValue = products.reduce((sum, p) => sum + (p.price * p.quantityInStock), 0);
    this.inStock = products.filter(p => p.quantityInStock > p.minStock).length;
    this.lowStock = products.filter(p => p.lowStock && p.quantityInStock > 0).length;
    this.outOfStock = products.filter(p => p.quantityInStock === 0).length;
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

  // ✅ Get status text & class
  getStatusClass(p: ProductDTO): string {
    if (p.quantityInStock === 0) return 'text-danger bg-danger bg-opacity-10 px-2 py-1 rounded';
    if (p.lowStock) return 'text-warning bg-warning bg-opacity-10 px-2 py-1 rounded';
    return 'text-success bg-success bg-opacity-10 px-2 py-1 rounded';
  }

  getStatusText(p: ProductDTO): string {
    if (p.quantityInStock === 0) return 'Out of Stock';
    if (p.lowStock) return 'Low Stock';
    return 'In Stock';
  }

  // ✅ Navigation functions
  goToSupplierList() {
    this.router.navigate(['/supplier-list']);
  }

  goToProductSupplierList() {
    this.router.navigate(['/product-supplier-list']);
  }

  goToCategoryList() {
    this.router.navigate(['/category-list']);
  }

 goToAddProduct() {
  this.router.navigate(['/product-supplier-list']);
}


  goToUpdateProduct(id: number) {
    this.router.navigate(['/product-update', id]);
  }

  updatePaginatedProducts() {
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  const endIndex = startIndex + this.itemsPerPage;
  this.paginatedProducts = this.filteredProducts.slice(startIndex, endIndex);
  this.totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
}


  // ✅ Delete product
  deleteProduct(id: number) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    this.productService.deleteProduct(id).subscribe({
      next: () => {
        alert('Product deleted successfully!');
        this.loadProducts();
      },
      error: (err) => console.error('Error deleting product:', err)
    });
  }
  showUpdateModal: boolean = false;
selectedProduct: ProductDTO | null = null;

// Open modal and load product details by id


// Close modal and clear selection


// Save changes to product
logout() {
  this.authService.logout();  // Clear token and session
  this.closeProfile();        // Close profile modal
  this.router.navigate(['/login']);  // Redirect to login page
}


}
