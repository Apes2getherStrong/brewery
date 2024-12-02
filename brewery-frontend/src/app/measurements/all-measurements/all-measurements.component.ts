import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import '@ag-grid-community/styles/ag-grid.css';
import '@ag-grid-community/styles/ag-theme-quartz.css';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ThemeService } from '../../sensor/service/theme.service';
import { SensorData } from '../../sensor/model/sensor.model';
import { SensorService } from '../../sensor/service/sensor.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core'; // Required for date functionality
import {MatTimepickerModule} from '@angular/material/timepicker';
import { FormsModule } from '@angular/forms';
import {DateTimeFilterComponent} from '../table/filter/date-time-filter/date-time-filter.component'; // Required for [(ngModel)]
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, AgGridModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTimepickerModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    CommonModule,],
  templateUrl: './all-measurements.component.html',
  styleUrl: './all-measurements.component.css',
  // encapsulation: ViewEncapsulation.None,
})
export class AllMeasurementsComponent implements OnInit {
  themeClass = 'ag-theme-quartz-dark';
  sensorData: SensorData[] | null = null;

  private gridApi!: GridApi;

  //https://www.ag-grid.com/javascript-data-grid/grid-size/#autoHeight
  //https://www.ag-grid.com/angular-data-grid/getting-started/

  constructor(private sensorService: SensorService, private themeService: ThemeService) {}

  ngOnInit(): void {
    this.themeService.isDarkMode$.subscribe((isDarkMode) => {
      this.themeClass = isDarkMode ? 'ag-theme-quartz-dark' : 'ag-theme-alpine';
    });

    this.sensorService.getSensorData().subscribe((data) => {
      this.sensorData = data;
    });
  }

  colDefs: ColDef<SensorData>[] = [
    { field: 'sensorType', headerName: 'Sensor Type' },
    { field: 'sensorNr', headerName: 'Sensor Number' },
    { field: 'value', headerName: 'Value' },
    { field: 'dateTime', headerName: 'Date/Time', valueFormatter: this.formatDate, filter: DateTimeFilterComponent },
  ];

  defaultColDef: ColDef = {
    flex: 1,
    filter: true,
    floatingFilter: true,
  };

  pagination = true;
  paginationPageSize = 500;
  paginationPageSizeSelector = [10, 25, 50];

  meetingDate: Date | null = null;
  meetingTime: Date | null = null;
  secondMeetingDate: Date | null = null;
  secondMeetingTime: Date | null = null;

  formatDate(params: any): string {
    const date = params.value as Date;
    return date ? new Date(date).toLocaleString() : '';
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
  }

  onExportCsv(): void {
    this.gridApi.exportDataAsCsv(); // Exports the data as a CSV file
  }




  onShowCsv(): void {
    // Retrieve CSV data as a string
    const csvData = this.gridApi.getDataAsCsv();

    if (!csvData) {
      console.error('No data available for export.');
      return;
    }

    // Log or process the CSV data
    console.log('CSV Data:', csvData);

    // Example: Converting CSV to JSON
    const jsonData = this.csvToJson(csvData);
    console.log('Converted JSON Data:', jsonData);
  }

  csvToJson(csvData: string): any[] {
    const lines = csvData.split('\n'); // Split CSV into lines
    const headers = lines[0].split(','); // Extract headers

    // Convert each line into a JSON object
    return lines.slice(1).filter(line => line.trim()).map((line) => {
      const values = line.split(',');
      return headers.reduce((acc, header, index) => {
        acc[header.trim()] = values[index]?.trim();
        return acc;
      }, {} as Record<string, string>);
    });
  }

}
