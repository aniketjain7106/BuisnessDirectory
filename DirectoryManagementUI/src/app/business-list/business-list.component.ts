// src/app/business-list/business-list.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { BusinessService } from '../services/business.service';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { BusinessFormComponent } from '../business-form/business-form.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { Business } from '../models/business';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';

@Component({
  selector: 'app-business-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    MatSortModule
  ],
  templateUrl: './business-list.component.html',
  styleUrls: ['./business-list.component.css']
})
export class BusinessListComponent implements OnInit {
  businesses: any[] = [];
  displayedColumns: string[] = ['name', 'category', 'city', 'address', 'stateZip', 'phone', 'website', 'rating', 'actions'];
  pageSizeOptions = [5, 10, 20, 50];
  
  // Search and Pagination Properties
  searchControl = new FormControl<string | undefined>('', { nonNullable: true });
  currentPage = 1;
  pageSize = 10;
  totalRecords = 0;
  totalPages = 0;
  
  // Sorting Properties
  @ViewChild(MatSort) sort!: MatSort;
  sortField = '';
  sortDirection: 'asc' | 'desc' | '' = '';

  constructor(
    private businessService: BusinessService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadBusinesses();
    this.setupSearch();
  }

  private setupSearch(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.currentPage = 1;
      this.loadBusinesses();
    });
  }

  loadBusinesses(): void {
    this.businessService.getBusinesses(
      this.currentPage,
      this.pageSize,
      this.searchControl.value,
      this.sortField,
      this.sortDirection
    ).subscribe({
      next: (response) => {
        this.businesses = response.data;
        this.totalRecords = response.totalRecords;
        this.totalPages = response.totalPages;
      },
      error: (err) => this.showError('Failed to load businesses')
    });
  }

  onSortChange(sortState: Sort): void {
    this.sortField = sortState.active;
    this.sortDirection = sortState.direction as 'asc' | 'desc';
    this.loadBusinesses();
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.loadBusinesses();
  }

  onPageChange(newPage: number): void {
    this.currentPage = newPage;
    this.loadBusinesses();
  }

  // Helper methods
  get showingStart(): number {
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get showingEnd(): number {
    const end = this.currentPage * this.pageSize;
    return end > this.totalRecords ? this.totalRecords : end;
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['error-snackbar']
    });
  }

  // Dialog methods
  openAddDialog(): void {
    const dialogRef = this.dialog.open(BusinessFormComponent, { width: '600px' });
    dialogRef.afterClosed().subscribe(result => result && this.loadBusinesses());
  }

  openEditDialog(business: Business): void {
    const dialogRef = this.dialog.open(BusinessFormComponent, {
      width: '600px',
      data: { business }
    });
    dialogRef.afterClosed().subscribe(result => result && this.loadBusinesses());
  }

  deleteBusiness(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Are you sure you want to delete this business?' }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.businessService.deleteBusiness(id).subscribe({
          next: () => {
            this.loadBusinesses();
            this.snackBar.open('Business deleted successfully!', 'Close', { duration: 3000 });
          },
          error: () => this.showError('Failed to delete business')
        });
      }
    });
  }
}