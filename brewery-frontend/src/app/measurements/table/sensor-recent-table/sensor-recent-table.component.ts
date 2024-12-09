import { Component } from '@angular/core';
import {ColDef, GridApi} from 'ag-grid-community';
import {SensorData} from '../../sensor/model/sensor.model';
import {SensorTableComponent} from '../sensors-table/sensor-table.component';
import {FormsModule} from '@angular/forms'

@Component({
  selector: 'app-sensor-recent-table',
  imports: [
    SensorTableComponent,
    FormsModule
  ],
  standalone: true,
  templateUrl: './sensor-recent-table.component.html',
  styleUrl: './sensor-recent-table.component.css'
})
export class SensorRecentTableComponent {

  private gridApi!: GridApi;

  avg: Number = 420.420

  colDefs: ColDef<SensorData>[] = [
    {field: 'sensorType', headerName: 'Sensor Type'},
    {field: 'sensorNr', headerName: 'Sensor Number'},
    {field: 'value', headerName: 'Value'},
    {field: 'dateTime', headerName: 'Date/Time', valueFormatter: this.formatDate},
  ];

  sensorData: SensorData[] | null = null;

  defaultColDef: ColDef = {
    flex: 1,
    filter: false,
    floatingFilter: false,
  };

  onGridReady(api: GridApi): void {
    this.gridApi = api;
  }

  formatDate(params: any): string {
    const date = params.value as Date;
    return date ? new Date(date).toLocaleString() : '';
  }
}
