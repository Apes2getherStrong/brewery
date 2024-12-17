import {Component, Input, OnInit} from '@angular/core';
import {ColDef, GridApi} from 'ag-grid-community';
import {SensorData} from '../../sensor/model/sensor.model';
import {SensorTableComponent} from '../sensors-table/sensor-table.component';
import {FormsModule} from '@angular/forms'
import {SensorService} from '../../sensor/service/sensor.service';
import {SensorSignalRService} from '../../sensor/service/sensor-signalr.service';

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
export class SensorRecentTableComponent implements OnInit{

  @Input() sensorNr!: number;

  sensorAvg: number = 0

  sensorRecentData: SensorData[] | null = null;

  private gridApi!: GridApi;

  colDefs: ColDef<SensorData>[] = [
    {field: 'sensorType', headerName: 'Sensor Type', flex: 2},
    {field: 'sensorNr', headerName: 'Sensor Number', flex: 1},
    {field: 'value', headerName: 'Value', flex: 1,  valueFormatter: this.formatValueBasedOnType.bind(this)},
    {field: 'dateTime', headerName: 'Date/Time', valueFormatter: this.formatDate, flex: 2},
  ];

  defaultColDef: ColDef = {
    flex: 1,
    filter: false,
    floatingFilter: false,
  };

  constructor(private sensorService: SensorService, private sensorSignalRService: SensorSignalRService) {}

  ngOnInit(): void {
    this.fetchRecentDataAndAvg();

    this.sensorSignalRService.onSensorDataReceived((data) => {
      this.validateNewSensorData(data);
    });
  }


  private fetchRecentDataAndAvg(): void {
    this.sensorService.getLatestSensorData(this.sensorNr, 100).subscribe({
      next: (data) => {
        this.sensorRecentData = data.sort((a, b) => {
          return new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();
        });
      },
      error: (err) => {
        console.error('Failed to fetch recent sensor data:', err);
        this.sensorRecentData = null;
      },
    });

    this.sensorService.getLatestSensorAvg(this.sensorNr, 100).subscribe({
      next: (data) => {
        this.sensorAvg = parseFloat(data.toFixed(3));
      }, error: (err) => {
        console.error('Failed to fetch recent sensor Avg:', err);
      }
    })
  }

  public validateNewSensorData(newData: SensorData): void {
    if(newData.sensorNr == this.sensorNr) {
      this.processNewSensorData(newData);
    }
  }

  private processNewSensorData(sensorData: SensorData): void {
    if (this.sensorRecentData) {
      let updatedData = [sensorData, ...this.sensorRecentData];

      if (updatedData.length > 100) {
        updatedData = updatedData.slice(0, 100);
      }

      this.sensorRecentData = updatedData;

      this.calculateSensorAvg();

      console.log("new data received in sensor ", this.sensorNr)
      console.log("data received: ", sensorData);
    }
  }

  private calculateSensorAvg(): void {
    if (this.sensorRecentData && this.sensorRecentData.length > 0) {
      const sum = this.sensorRecentData.reduce((acc, curr) => acc + curr.value, 0);
      this.sensorAvg = parseFloat((sum / this.sensorRecentData.length).toFixed(3));
    }
  }


  onGridReady(api: GridApi): void {
    this.gridApi = api;
  }

  formatDate(params: any): string {
    const date = params.value as Date;
    return date ? new Date(date).toLocaleString() : '';
  }

  formatValueBasedOnType(params: any): string {
    const data = params.data as SensorData; // Access the entire row data
    const value = params.value;

    if (data && value !== null && value !== undefined) {
      switch (data.sensorType) {
        case 'TEMPERATURE':
          return `${value} °C`;
        case 'ALCOHOL_CONTENT_PERCENT':
          return `${value} %`;
        case 'PRESSURE':
          return `${value} Pa`;
        case 'PH':
          return `${value} Ph`;
        default:
          return value.toString();
      }
    }

    return '';
  }

}
