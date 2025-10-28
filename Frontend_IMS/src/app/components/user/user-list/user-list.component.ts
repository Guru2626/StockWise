import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserDTO } from '../../../models/user.model';
import { AdminService } from '../../../service/admin.service';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';

@Component({
  selector: 'user-list',
  standalone: true,
  imports: [CommonModule, RouterModule,FormsModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  users: UserDTO[] = [];
  filteredUsers: UserDTO[] = [];
  searchTerm: string = '';
  errorMsg: string = '';

  constructor(private adminService: AdminService, private location:Location) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.adminService.getAllUsers().subscribe({
      next: (res) => {
        this.users = res;
        this.filteredUsers = res;
      },
      error: () => this.errorMsg = 'Failed to load users'
    });
  }

  promote(userId: number) {
    this.adminService.promoteToManager(userId).subscribe({
      next: (res) => {
        const user = this.users.find(u => u.userId === userId);
        if (user) user.roleName = 'Manager';
        alert(res?.message || 'User promoted to Manager!');
      },
      error: (err) => {
        console.error('Promotion error:', err);
        alert('Failed to promote user');
      }
    });
  }

  // ✅ Search by name or email
  onSearchChange() {
    const term = this.searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(u =>
      u.userName.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term)
    );
  }

  deleteUser(userId: number) {
  if (!confirm('Are you sure you want to delete this user?')) {
    return;
  }

  this.adminService.deleteUser(userId).subscribe({
    next: (res) => {
      this.users = this.users.filter(u => u.userId !== userId);
      this.filteredUsers = this.filteredUsers.filter(u => u.userId !== userId);
      alert(res?.message || 'User deleted successfully!');
    },
    error: (err) => {
      console.error('Delete error:', err);
      alert('Failed to delete user');
    }
  });
}
goBack(): void {
    this.location.back();
  }

}
