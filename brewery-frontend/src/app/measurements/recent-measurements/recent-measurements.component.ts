import { Component } from '@angular/core';
import {NgForOf} from '@angular/common';
import {SensorRecentTableComponent} from '../table/sensor-recent-table/sensor-recent-table.component';

@Component({
  selector: 'app-recent-measurements',
  standalone: true,
  imports: [
    NgForOf,
    SensorRecentTableComponent
  ],
  templateUrl: './recent-measurements.component.html',
  styleUrl: './recent-measurements.component.css'
})
export class RecentMeasurementsComponent {
  items = Array.from({ length: 16 }, (_, i) => i + 1);

}
