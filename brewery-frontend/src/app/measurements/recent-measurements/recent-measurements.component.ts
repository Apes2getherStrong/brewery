import { Component } from '@angular/core';
import {NgForOf} from '@angular/common';
import {SensorRecentTableComponent} from '../table/sensor-recent-table/sensor-recent-table.component';
import {SensorSignalRService} from '../sensor/service/sensor-signalr.service';

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

  sensorData: any[] = [];

  constructor(private sensorSignalRService: SensorSignalRService) {}

  ngOnInit(): void {
    // Rozpoczęcie połączenia z SignalR
    this.sensorSignalRService.startConnection();

    // Subskrypcja zdarzeń SignalR
    this.sensorSignalRService.onSensorDataReceived((data) => {
      console.log('Otrzymano dane sensora:', data);
      this.sensorData.push(data); // Dodanie danych do listy
    });
  }

}
