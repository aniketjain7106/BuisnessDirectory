// src/app/models/business.model.ts
export interface Business {
    businessID: number;
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phoneNumber: string;
    category: string;
    website: string;
    rating: number;
    createdAt: Date;
    updatedAt: Date;
  }
  