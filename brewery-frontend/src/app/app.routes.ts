import { Routes } from '@angular/router';
import {AllMeasurementsComponent} from './measurements/all-measurements/all-measurements.component';

export const routes: Routes = [
  { path: '', component: AllMeasurementsComponent },
  { path: '**', redirectTo: '' }
];
