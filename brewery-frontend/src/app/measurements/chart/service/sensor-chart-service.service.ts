import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {SensorData} from '../../sensor/model/sensor.model';
import {AgChartOptions} from 'ag-charts-community';

@Injectable({
  providedIn: 'root',
})
export class SensorChartService {
  private sensorDataSubject = new BehaviorSubject<SensorData[] | null>(null);

  public sensorData$: Observable<SensorData[] | null> = this.sensorDataSubject.asObservable();



  constructor() {}

  setSensorData(data: SensorData[]): void {
    this.sensorDataSubject.next(data);
  }
}
