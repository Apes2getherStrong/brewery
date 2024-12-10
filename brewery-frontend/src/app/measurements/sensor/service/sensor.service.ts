import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {delay, map, Observable, of} from 'rxjs';
import { SENSOR_TYPE, SensorData } from '../model/sensor.model';

@Injectable({
  providedIn: 'root',
})
export class SensorService {
  private apiUrl = 'http://localhost:5000/api/sensordata';

  constructor(private http: HttpClient) {}

  getLatestSensorData(sensorNr: number, howManyRecords: number): Observable<SensorData[]> {
    const params = new HttpParams()
      .set('sensorNr', sensorNr.toString())
      .set('howManyRecords', howManyRecords.toString());

    return this.http.get<SensorData[]>(`${this.apiUrl}/latest`, { params });
  }

  getLatestSensorAvg(sensorNr: number, howManyRecords: number): Observable<number> {
    const params = new HttpParams()
      .set('sensorNr', sensorNr.toString())
      .set('howManyRecords', howManyRecords.toString());

    return this.http.get<number>(`${this.apiUrl}/latest/avg`, { params });
  }

  getSensorDataInRange(startDate: Date, endDate: Date): Observable<SensorData[]> {
    console.log(startDate);
    console.log(endDate);

    const params = new HttpParams()
      .set('start', startDate.toISOString())
      .set('end', endDate.toISOString());

    return this.http.get<SensorData[]>(`${this.apiUrl}/daterange`, { params });
  }

  getAllSensorData(): Observable<SensorData[]> {
    return this.http.get<SensorData[]>(`${this.apiUrl}`).pipe(
      map((data: any[]) =>
        data.map(item => ({
          ...item,
          value: parseFloat(item.value),
          dateTime: new Date(item.date),
        }))
      )
    );
  }

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
