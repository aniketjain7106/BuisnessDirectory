// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BusinessListComponent } from './business-list/business-list.component';

const routes: Routes = [
  { path: '', component: BusinessListComponent },
  { path: '**', redirectTo: '' } // Redirect to the business list if the route is not found
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }