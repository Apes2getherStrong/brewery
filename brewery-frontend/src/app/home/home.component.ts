import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {AgGridModule} from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import '@ag-grid-community/styles/ag-grid.css';
import '@ag-grid-community/styles/ag-theme-quartz.css';
import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ThemeService} from '../service/theme.service';
import {SensorData} from '../sensor/model/sensor.model';
import {SensorService} from '../service/sensor.service';


@Component({
  standalone: true,
  selector: 'app-home',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule,  AgGridModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  //encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit {

  themeClass =
    //"ag-theme-quartz";
    "ag-theme-quartz-dark";


  //https://www.ag-grid.com/javascript-data-grid/grid-size/#autoHeight
  //https://www.ag-grid.com/angular-data-grid/getting-started/



  sensorData: SensorData[] | null = null;

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
    { field: 'dateTime', headerName: 'Date/Time', valueFormatter: this.formatDate },
  ];



  defaultColDef: ColDef = {
    flex: 1,
    filter: true,
    floatingFilter: true,
  };

  pagination = true;
  paginationPageSize = 500;
  paginationPageSizeSelector = [10, 25, 50];

  formatDate(params: any): string {
    const date = params.value as Date;
    return date ? new Date(date).toLocaleString() : '';
  }

}
