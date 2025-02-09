// src/app/app.component.ts
import { Component } from '@angular/core';
import { BusinessListComponent } from './business-list/business-list.component';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MatToolbarModule, BusinessListComponent],
  template: `
    <mat-toolbar color="primary">
      <span>Business Directory</span>
    </mat-toolbar>
    <app-business-list></app-business-list>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
    }
  `]
})
export class AppComponent {}