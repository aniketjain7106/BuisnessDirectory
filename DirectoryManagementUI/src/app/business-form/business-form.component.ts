// src/app/business-form/business-form.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BusinessService } from '../services/business.service';
import { CategoryService } from '../services/category.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Category } from '../models/category';
import { Business } from '../models/business';

@Component({
  selector: 'app-business-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './business-form.component.html',
  styleUrls: ['./business-form.component.css']
})
export class BusinessFormComponent implements OnInit {
  businessForm: FormGroup;
  categories: Category[] = [];
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    private businessService: BusinessService,
    private categoryService: CategoryService,
    private dialogRef: MatDialogRef<BusinessFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { business: Business }
  ) {
    this.businessForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/)]],
      website: ['', Validators.pattern(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/)],
      rating: [0, [Validators.min(0), Validators.max(5)]]
    });

    if (data?.business) {
      this.isEdit = true;
      this.businessForm.patchValue(data.business);
    }
  }

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  onSubmit(): void {
    if (this.businessForm.valid) {
      const business = this.businessForm.value;
      if (this.isEdit) {
        this.businessService.updateBusiness(this.data.business.businessID, business)
          .subscribe(() => this.dialogRef.close(true));
      } else {
        this.businessService.createBusiness(business)
          .subscribe(() => this.dialogRef.close(true));
      }
    }
  }
}