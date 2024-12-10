import { Routes } from '@angular/router';
import { AllMeasurementsComponent } from './measurements/all-measurements/all-measurements.component';
import {RecentMeasurementsComponent} from './measurements/recent-measurements/recent-measurements.component';
import {AdminPanelComponent} from './admin-panel/admin-panel.component';

export const routes: Routes = [
  { path: 'measurements/all', component: AllMeasurementsComponent },
  { path: 'measurements/recent', component: RecentMeasurementsComponent },
  { path: 'admin-panel', component: AdminPanelComponent },
  { path: '', redirectTo: '/measurements/all', pathMatch: 'full' },
  { path: '**', redirectTo: '/measurements/all' }
];
