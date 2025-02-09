// src/app/services/category.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root' // Provided at the root level for singleton instance
})
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/api/Category`; // Base URL for the Category API

  constructor(private http: HttpClient) { }

  /**
   * Fetches all categories from the backend.
   * @returns An observable of the category array.
   */
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }
}