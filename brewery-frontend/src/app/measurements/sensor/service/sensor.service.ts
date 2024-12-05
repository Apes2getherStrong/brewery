import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { SENSOR_TYPE, SensorData } from '../model/sensor.model';

@Injectable({
  providedIn: 'root',
})
export class SensorService {

  private generateMockData(): SensorData[] {
    const randomSensorData: SensorData[] = [];
    const startDate = new Date(2023, 2, 1);
    const sensorTypes = Object.values(SENSOR_TYPE);

    for (let i = 0; i < 50; i++) {
      const randomDate = new Date(
        startDate.getTime() +
        Math.random() * (new Date().getTime() - startDate.getTime())
      );

      randomSensorData.push({
        sensorType: sensorTypes[Math.floor(Math.random() * sensorTypes.length)],
        sensorNr: Math.ceil(Math.random() * 16),
        value: parseFloat((Math.random() * 100).toFixed(2)),
        dateTime: randomDate,
      });
    }

    return randomSensorData;
  }


  getSensorData(): Observable<SensorData[]> {
    const mockData = this.generateMockData();
    const delayTime = 2000; // Simulate network delay
    return of(mockData).pipe(delay(delayTime));
  }
}
