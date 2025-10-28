import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../../service/category.service';
import { CategoryDTO } from '../../../models/category.model';
import { FormsModule, NgForm } from '@angular/forms';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {

  categories: CategoryDTO[] = [];
  newCategoryName: string = '';
  errorMsg: string = '';
  successMsg: string = '';
  userRole: string = '';

  constructor(private categoryService: CategoryService, private location: Location, public router:Router) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadUserRole();
  }

  // Load all categories
  loadCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (res) => this.categories = res,
      error: () => this.errorMsg = 'Failed to load categories'
    });
  }

  // Load current user's role from JWT token
  loadUserRole() {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.userRole = payload.role.replace('ROLE_', ''); // e.g., "ADMIN", "STAFF"
    }
  }

  // Create new category (only for Admin/Manager)
  addCategory(form: NgForm) {
    if (form.invalid) return;

    const categoryRequest = { categoryName: this.newCategoryName };
    this.categoryService.createCategory(categoryRequest).subscribe({
      next: (res) => {
        this.successMsg = `Category "${res.categoryName}" added successfully`;
        this.newCategoryName = '';
        this.loadCategories();
      },
      error: () => this.errorMsg = 'Failed to add category'
    });
  }

  // Delete category (only for Admin/Manager)
  // src/app/components/category-list/category-list.component.ts
isDeleting = false; // add this field near other state fields

deleteCategory(categoryId: number) {
  if (!confirm('Are you sure you want to delete this category?')) return;

  this.isDeleting = true;
  this.errorMsg = '';
  this.successMsg = '';

  // Optimistic update: remove locally so user sees immediate change
  const original = [...this.categories];
  this.categories = this.categories.filter(c => c.categoryId !== categoryId);

  this.categoryService.deleteCategory(categoryId).subscribe({
    next: (res) => {
      // res is likely a plain text message from backend
      this.successMsg = typeof res === 'string' && res.length ? res : 'Category deleted successfully';
      // reload to be safe (optional) — keeps counts accurate
      this.loadCategories();
      // clear message after 3s
      setTimeout(() => this.successMsg = '', 3000);
      this.isDeleting = false;
    },
    error: (err) => {
      console.error('Delete failed:', err);
      this.errorMsg = 'Failed to delete category. Please try again.';
      // rollback optimistic change
      this.categories = original;
      this.isDeleting = false;
      setTimeout(() => this.errorMsg = '', 5000);
    }
  });
}

  goToAddCategory() {
  this.router.navigate(['/category-add']);
  }
  
  goBack(): void {
    this.location.back();
  }
}
