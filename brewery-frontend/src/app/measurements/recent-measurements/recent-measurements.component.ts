import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgForOf} from '@angular/common';
import {SensorRecentTableComponent} from '../table/sensor-recent-table/sensor-recent-table.component';
import {SensorSignalRService} from '../sensor/service/sensor-signalr.service';
import {SensorsApexChartComponent} from '../chart/sensors-chart/sensors-apex-chart.component';

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
export class RecentMeasurementsComponent implements  OnInit, OnDestroy {
  sensorNumbers = Array.from({ length: 16 }, (_, i) => i + 1);


  constructor(private sensorSignalRService: SensorSignalRService) {}

  ngOnInit(): void {
    this.sensorSignalRService.startConnection();

    this.sensorSignalRService.onSensorDataReceived((data) => {
      console.log('[SINGALR] new data from sensor:', data);

    });
  }

  ngOnDestroy(): void {

    this.sensorSignalRService.stopConnection();
  }

}
