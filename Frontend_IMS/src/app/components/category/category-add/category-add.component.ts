import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { CategoryService } from '../../../service/category.service';
import { CategoryRequestDTO } from '../../../models/category-request.model';

@Component({
  selector: 'category-add',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category-add.component.html',
  styleUrls: ['./category-add.component.css']
})
export class CategoryAddComponent {

  newCategory: CategoryRequestDTO = {
    categoryName: '',
    
  };

  successMsg = '';
  errorMsg = '';

  constructor(
    private categoryService: CategoryService,
    public router: Router,
    private location: Location
  ) {}

  addCategory(form: NgForm) {
  if (form.invalid) return;

  this.successMsg = '';
  this.errorMsg = '';

  this.categoryService.createCategory(this.newCategory).subscribe({
    next: (res) => {
      console.log('Category created:', res);
      this.successMsg = `Category  added successfully!`;
      

      // Wait before redirecting so success message can show
      setTimeout(() => {
        this.router.navigate(['/category-list']);
      }, 1500);
    },
    error: (err) => {
      console.error('Error while creating category:', err);
      this.errorMsg = 'Failed to add category. Please try again.';
    }
  });
}


  goBack(): void {
    this.location.back();
  }
}
