import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {AgGridModule} from 'ag-grid-angular';
import {ColDef, GridApi, GridReadyEvent} from 'ag-grid-community';
import '@ag-grid-community/styles/ag-grid.css';
import '@ag-grid-community/styles/ag-theme-quartz.css';
import {Component, OnInit} from '@angular/core';
import {SENSOR_TYPE, SensorData} from '../sensor/model/sensor.model';
import {SensorService} from '../sensor/service/sensor.service';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatTimepickerModule} from '@angular/material/timepicker';
import {FormsModule} from '@angular/forms';
import {DateTimeFilterComponent} from '../table/filter/date-time-filter/date-time-filter.component';
import {CommonModule} from '@angular/common';
import {StringDateTimeConverterService} from '../table/converter/string-date-time-converter.service';
import {faDownload} from '@fortawesome/free-solid-svg-icons';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {CsvToJsonConverterService} from '../table/converter/csv-to-json-converter.service';
import {SensorChartComponent} from '../chart/sensor-chart/sensor-chart.component';
import {SensorTableComponent} from '../table/sensors-table/sensor-table.component';

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
    CommonModule, FaIconComponent, SensorChartComponent, SensorTableComponent, SensorTableComponent,],
  templateUrl: './all-measurements.component.html',
  styleUrl: './all-measurements.component.css',
})
export class AllMeasurementsComponent implements OnInit {

  protected readonly faDownload = faDownload;


  sensorData: SensorData[] | null = null;
  displayedSensorData: SensorData[] | null = null;

  private gridApi!: GridApi;

  colDefs: ColDef<SensorData>[] = [
    {field: 'sensorType', headerName: 'Sensor Type'},
    {field: 'sensorNr', headerName: 'Sensor Number'},
    {field: 'value', headerName: 'Value',  valueFormatter: this.formatValueBasedOnType.bind(this),},
    {field: 'dateTime', headerName: 'Date/Time', valueFormatter: this.formatDate, filter: DateTimeFilterComponent},
  ];

  defaultColDef: ColDef = {
    flex: 1,
    filter: true,
    floatingFilter: true,
  };

  pagination = true;
  paginationPageSize = 500;
  paginationPageSizeSelector = [10, 25, 50];


  startDate: String = "";
  startTime: String = "";
  endDate: String = "";
  endTime: String = "";

  date: Date = new Date;

  jsonData: Record<string, string>[] | undefined | null = null;
  csvData: String = "";

  shouldFindAll: boolean = false;


  constructor(private sensorService: SensorService,
              private stringDateTimeConvertorService: StringDateTimeConverterService,
              private csvToJsonConverterService: CsvToJsonConverterService) {}

  ngOnInit(): void {

    this.initDateAndTime()

    //this.getData();

    //mock data for testing:
    this.displayedSensorData = this.sensorService.generateMockData();
    this.sensorData = this.sensorService.generateMockData();
  }

  initDateAndTime(): void {
    const now = new Date();

    const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60000);

    this.startDate = this.stringDateTimeConvertorService.getStringDateFromDateTimeKebab(fifteenMinutesAgo);
    this.startTime = this.stringDateTimeConvertorService.getStringTimeFromDateTimeColon(fifteenMinutesAgo);

    this.endDate = this.stringDateTimeConvertorService.getStringDateFromDateTimeKebab(now);
    this.endTime = this.stringDateTimeConvertorService.getStringTimeFromDateTimeColon(now);

  }

  formatDate(params: any): string {
    const date = params.value as Date;
    return date ? new Date(date).toLocaleString() : '';
  }

  onGridReady(api: GridApi): void {
    this.gridApi = api;
    this.onShowJson();
    this.onShowCsv();
  }

  getData() {

    let data: SensorData[] = [];
    if(this.shouldFindAll) {
      this.getAllData();
    }
    else {
      this.getDataFromDateTimeRange();
    }

    this.onShowJson();
    this.onShowCsv();
  }

  getAllData() {
    this.sensorService.getAllSensorData().subscribe((data) => {

      this.sensorData = data;
      this.displayedSensorData = this.sensorData;

    })
  }

  getDataFromDateTimeRange() {
    const startDateTime = this.stringDateTimeConvertorService.getDateTimeFromStringDateAndStringTime(this.startDate, this.startTime);
    const endDateTime = this.stringDateTimeConvertorService.getDateTimeFromStringDateAndStringTime(this.endDate, this.endTime);
    this.sensorService.getSensorDataInRange(startDateTime, endDateTime).subscribe((data) => {

      this.sensorData = data;
      this.displayedSensorData = this.sensorData;

    });
  }


  setStartDateTimeToNow() {
    this.startDate = this.stringDateTimeConvertorService.getStringDateFromDateTimeKebab(new Date());
    this.startTime = this.stringDateTimeConvertorService.getStringTimeFromDateTimeColon(new Date());
  }

  setEndDateTimeToNow() {
    this.endDate = this.stringDateTimeConvertorService.getStringDateFromDateTimeKebab(new Date());
    this.endTime = this.stringDateTimeConvertorService.getStringTimeFromDateTimeColon(new Date());
  }


  onShowCsv(): void {
    if(this.gridApi) {
      const csvData = this.gridApi.getDataAsCsv();
      if (!csvData) {
        console.error('No data available for export.');
        return;
      }

      this.csvData = csvData
    }
  }

  onDownloadCsv() {
    this.gridApi.exportDataAsCsv();
  }

  onDownloadJson(): void {
    if (!this.jsonData) {
      console.error('No JSON data available for download.');
      return;
    }

    const jsonStr = JSON.stringify(this.jsonData, null, 2);

    const blob = new Blob([jsonStr], {type: 'application/json'});

    const link = document.createElement('a');

    const url = URL.createObjectURL(blob);
    link.href = url;

    link.download = 'output.json';

    link.click();

    URL.revokeObjectURL(url);
  }


  onShowJson(): void {
    if(this.gridApi) {
      const csvData = this.gridApi.getDataAsCsv();
      if (!csvData) {
        console.error('No data available for export.');
        return;
      }

      this.jsonData = this.csvToJsonConverterService.convertCsvToJson(csvData);
    }
  }

  onFilterChanged() {
    this.updateChart();
    this.onShowJson();
    this.onShowCsv();
  }

  private updateChart(): void {
    const renderedNodes = this.gridApi.getRenderedNodes();
    this.displayedSensorData = renderedNodes.map(node => node.data);
  }

  onSortChanged() {
    this.onShowJson();
    this.onShowCsv();
  }

  onFirstDataRendered() {
    this.onShowJson();
    this.onShowCsv();
  }

  formatValueBasedOnType(params: any): string {
    const data = params.data as SensorData;
    const value = params.value;

    if (data && value !== null && value !== undefined) {
      switch (data.sensorType) {
        case SENSOR_TYPE.TEMPERATURE:
          return `${value} °C`;
        case SENSOR_TYPE.ALCOHOL_CONTENT_PERCENT:
          return `${value} %`;
        case SENSOR_TYPE.PRESSURE:
          return `${value} Bar`;
        case SENSOR_TYPE.PH:
          return `${value} Ph`;
        default:
          return value.toString();
      }
    }

    return '';
  }
}
