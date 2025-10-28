import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';   
import { Router } from '@angular/router';         
import { SupplierService } from '../../../service/supplier.service';
import { SupplierDTO } from '../../../models/supplier.model';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';

@Component({
  selector: 'supplier-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.css']
})
export class SupplierListComponent implements OnInit {

  suppliers: SupplierDTO[] = [];
  successMsg = '';
  errorMsg = '';
  userRole = '';

  constructor(
    private supplierService: SupplierService,
    public router: Router,
    private location:Location
  ) {}

  ngOnInit(): void {
    this.loadSuppliers();
    this.userRole = localStorage.getItem('role') || 'ADMIN';
    console.log('User Role:', this.userRole); // Log role to verify
  }

  loadSuppliers() {
    this.supplierService.getAllSuppliers().subscribe({
      next: (data) => (this.suppliers = data),
      error: (err) => console.error('Error fetching suppliers:', err)
      
    });
  }

  deleteSupplier(id: number) {
    if (!confirm('Are you sure you want to delete this supplier?')) return;

    this.supplierService.deleteSupplier(id).subscribe({
      next: () => {
        this.successMsg = 'Supplier deleted successfully!';
        this.errorMsg = '';
        this.loadSuppliers();
      },
      error: (err) => {
        this.errorMsg = 'Failed to delete supplier';
        this.successMsg = '';
        console.error(err);
      }
    });
  }

  navigateToAddSupplier() {
    this.router.navigate(['/supplier-add']);
  }
  goBack(): void {
    this.location.back();
  }
}
