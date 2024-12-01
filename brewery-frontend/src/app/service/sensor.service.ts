import {Injectable} from '@angular/core';
import {delay, Observable, of} from 'rxjs';
import {SENSOR_TYPE, SensorData} from '../sensor/model/sensor.model';

@Injectable({
  providedIn: 'root',
})
export class SensorService {

  /**
   * Simulates fetching sensor data from a backend with a delay.
   * @returns Observable<SensorData[]>
   */
  getSensorData(): Observable<SensorData[]> {
    const mockData: SensorData[] = [
      {
        sensorType: SENSOR_TYPE.TEMPERATURE,
        sensorNr: 1,
        value: 23.5,
        dateTime: new Date(),
      },
      {
        sensorType: SENSOR_TYPE.HUMIDITY,
        sensorNr: 2,
        value: 60.2,
        dateTime: new Date(),
      },
      {
        sensorType: SENSOR_TYPE.PRESSURE,
        sensorNr: 3,
        value: 1013.25,
        dateTime: new Date(),
      },
    ];

    const delayTime = 2000;

    return of(mockData).pipe(delay(delayTime));
  }
}
