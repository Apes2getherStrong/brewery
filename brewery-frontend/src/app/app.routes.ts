import { Routes } from '@angular/router';
import { AllMeasurementsComponent } from './measurements/all-measurements/all-measurements.component';
import {RecentMeasurementsComponent} from './measurements/recent-measurements/recent-measurements.component';

export const routes: Routes = [
  { path: 'measurements/all', component: AllMeasurementsComponent },
  { path: 'measurements/recent', component: RecentMeasurementsComponent },
  { path: '', redirectTo: '/measurements/all', pathMatch: 'full' },
  { path: '**', redirectTo: '/measurements/all' }
];
