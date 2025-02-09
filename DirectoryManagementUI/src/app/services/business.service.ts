// src/app/services/business.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Business } from '../models/business';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BusinessService {
  private apiUrl = `${environment.apiUrl}/api/Business`;

  constructor(private http: HttpClient) { }

  getBusinesses(
    page: number = 1,
    pageSize: number = 10,
    keyword?: string,
    sortField?: string,
    sortDirection?: string
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (keyword) params = params.set('keyword', keyword);
    if (sortField) params = params.set('sortField', sortField);
    if (sortDirection) params = params.set('sortDirection', sortDirection);

    return this.http.get<any>(this.apiUrl, { params });
  }

  createBusiness(business: Business): Observable<Business> {
    return this.http.post<Business>(this.apiUrl, business);
  }

  updateBusiness(id: number, business: Business): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, business);
  }

  deleteBusiness(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}