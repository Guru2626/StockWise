import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DashboardService } from '../../../service/dashboard.service';
import { TransactionService } from '../../../service/transaction.service';
import { TransactionDTO } from '../../../models/transaction.model';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { UserDTO } from '../../../models/user.model';
import { AdminService } from '../../../service/admin.service';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NgxChartsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  stats = [
    { title: 'Suppliers', value: '0', icon: 'bi-truck', bg: 'bg-info-subtle' },
    { title: 'Supplier Products', value: '0', icon: 'bi-box-seam', bg: 'bg-success-subtle' },
    { title: 'Purchase Transactions', value: '0', icon: 'bi-arrow-down-circle', bg: 'bg-warning-subtle' },
    { title: 'Sale Transactions', value: '0', icon: 'bi-arrow-up-circle', bg: 'bg-danger-subtle' }
  ];

  chartData: any[] = [];
  view: [number, number] = [700, 300];
  colorScheme: any = {
    name: 'customScheme',
    selectable: true,
    group: 'Ordinal',
    domain: ['#42A5F5', '#66BB6A']
  };

  totalRevenue: number = 0; // 💰 For displaying total revenue
  selectedUser?: UserDTO;
showProfileModal: boolean = false;
  constructor(
    private router: Router,
    private dashboardService: DashboardService,
    private transactionService: TransactionService,
    private adminService: AdminService,
    private authService:AuthService
  ) {}

  ngOnInit(): void {
    this.loadDashboardCounts();
    this.loadTransactionChart();
  }

  loadDashboardCounts() {
    this.dashboardService.getCounts().subscribe({
      next: ({ suppliers$, productSuppliers$, transactions$ }) => {
        this.stats[0].value = suppliers$.length;
        this.stats[1].value = productSuppliers$.length;
        this.stats[2].value = transactions$.filter((t: any) => t.transactionType === 'Purchase').length;
        this.stats[3].value = transactions$.filter((t: any) => t.transactionType === 'Sale').length;
      },
      error: (err) => console.error('Error loading dashboard counts:', err)
    });
  }

  loadTransactionChart() {
    this.transactionService.getAllTransactions().subscribe({
      next: (transactions: TransactionDTO[]) => {
        const totalPurchase = transactions
          .filter(t => t.transactionType === 'Purchase')
          .reduce((sum, t) => sum + (t.quantity * t.price), 0);

        const totalSale = transactions
          .filter(t => t.transactionType === 'Sale')
          .reduce((sum, t) => sum + (t.quantity * t.price), 0);

        // 💰 Calculate total revenue (Sale - Purchase)
        this.totalRevenue = totalSale - totalPurchase;

        // Chart Data
        this.chartData = [
          { name: 'Purchase', value: totalPurchase },
          { name: 'Sale', value: totalSale }
        ];
      },
      error: (err) => console.error('Error loading transaction data:', err)
    });
  }

  openProfile() {
  const userId = 1; // you can fetch this from token or context if dynamic
  this.adminService.getUserById(userId).subscribe({
    next: (user) => {
      this.selectedUser = user;
      this.showProfileModal = true;
    },
    error: (err) => console.error('Error fetching user:', err)
  });
}

closeProfile() {
  this.showProfileModal = false;
}


  // Navigation
  goToSuppliers() { this.router.navigate(['/supplier-list']); }
  goToSupplierProducts() { this.router.navigate(['/product-supplier-list']); }
  goToTransactions() { this.router.navigate(['/transaction-list']); }
  goToUsers() { this.router.navigate(['/user-list']); }

  onCardClick(index: number) {
    switch (index) {
      case 0: this.goToSuppliers(); break;
      case 1: this.goToSupplierProducts(); break;
      case 2:
      case 3: this.goToTransactions(); break;
      default: console.warn('Unknown card clicked');
    }
  }
  logout() {
  this.authService.logout();  // Clear token and session
  this.closeProfile();        // Close profile modal
  this.router.navigate(['/login']);  // Redirect to login page
}

}
