import { Routes } from '@angular/router';
import { LoginComponent } from './components/user/login/login.component';
import { SignUpComponent } from './components/user/sign-up/sign-up.component';
import { AdminDashboardComponent } from './components/dashboard/admin-dashboard/admin-dashboard.component';
import { ManagerDashboardComponent } from './components/dashboard/manager-dashboard/manager-dashboard.component';
import { UserListComponent } from './components/user/user-list/user-list.component';
import { StaffDashboardComponent } from './components/dashboard/staff-dashboard/staff-dashboard.component';
import { SupplierListComponent } from './components/supplier/supplier-list/supplier-list.component';
import { TransactionListComponent } from './components/transaction/transaction-list/transaction-list.component';
import { CategoryListComponent } from './components/category/category-list/category-list.component';
import { SupplierAddComponent } from './components/supplier/supplier-add/supplier-add.component';
import { ProductSupplierListComponent } from './components/product-supplier/product-supplier-list/product-supplier-list.component';
import { ProductSupplierAddComponent } from './components/product-supplier/product-supplier-add/product-supplier-add.component';
import { PurchaseComponent } from './components/transaction/purchase/purchase.component';
import { SaleComponent } from './components/transaction/sale/sale.component';
import { CategoryAddComponent } from './components/category/category-add/category-add.component';
import { authGuard } from './guard/auth.guard';

// Adjust path accordingly

export const routes: Routes = [
  { path:'login', component: LoginComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path:'user-list', component: UserListComponent, canActivate: [authGuard] },
  { path:'admin-dashboard', component: AdminDashboardComponent, canActivate: [authGuard] },
  { path:'manager-dashboard', component: ManagerDashboardComponent, canActivate: [authGuard] },
  { path:'staff-dashboard', component: StaffDashboardComponent, canActivate: [authGuard] },

  { path:'category-list', component: CategoryListComponent, canActivate: [authGuard] },
  { path:'category-add', component: CategoryAddComponent, canActivate: [authGuard] },

  { path:'supplier-list', component: SupplierListComponent, canActivate: [authGuard] },
  { path:'supplier-add', component: SupplierAddComponent, canActivate: [authGuard] },
  { path:'transaction-list', component: TransactionListComponent, canActivate: [authGuard] },

  { path:'product-supplier-list', component: ProductSupplierListComponent, canActivate: [authGuard] },
  { path:'product-supplier-add', component: ProductSupplierAddComponent, canActivate: [authGuard] },

  { path:'purchase', component: PurchaseComponent, canActivate: [authGuard] },
  { path:'sale', component: SaleComponent, canActivate: [authGuard] },

  { path: '', redirectTo: 'login', pathMatch:'full' }
];
