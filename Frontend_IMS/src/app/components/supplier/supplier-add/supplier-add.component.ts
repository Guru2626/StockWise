import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SupplierService } from '../../../service/supplier.service';
import { SupplierRequestDTO } from '../../../models/supplier-request.model';
import  {Location} from '@angular/common'

@Component({
  selector: 'supplier-add',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './supplier-add.component.html',
  styleUrls: ['./supplier-add.component.css']
})
export class SupplierAddComponent {

  newSupplier: SupplierRequestDTO = {
    supplierName: '',
    email: '',
    phone: '',
    address: '',
    city: ''
  };

  successMsg = '';
  errorMsg = '';

  constructor(private supplierService: SupplierService, public router: Router, private location:Location) {}

  addSupplier(form: any) {
    if (form.invalid) return;

    this.supplierService.createSupplier(this.newSupplier).subscribe({
      next: () => {
        this.successMsg = 'Supplier added successfully!';
        setTimeout(() => this.router.navigate(['/suppliers']), 1500);
      },
      error: () => {
        this.errorMsg = 'Failed to add supplier';
      }
    });
  }
   goBack(): void {
    this.location.back();
  }
}
