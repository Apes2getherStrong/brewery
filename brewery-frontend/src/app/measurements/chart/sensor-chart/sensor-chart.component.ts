import {Component, OnInit} from '@angular/core';
import {SensorChartService} from '../service/sensor-chart-service.service';
import {SensorData} from '../../sensor/model/sensor.model';
import {AgCharts} from 'ag-charts-angular';
import {AgChartOptions} from 'ag-charts-community';

@Component({
  selector: 'app-sensor-chart',
  standalone: true,
  imports: [
    AgCharts
  ],
  templateUrl: './sensor-chart.component.html',
  styleUrl: './sensor-chart.component.css'
})
export class SensorChartComponent implements OnInit {

  sensorData: SensorData[] | null = null;

  public chartOptions: AgChartOptions = {
    // Data: Data to be displayed in the chart


    //https://www.ag-grid.com/charts/angular/scatter-series/
    theme: 'ag-vivid-dark',
    data: [
      {month: 'Jan', avgTemp: 2.3, iceCreamSales: 162000},
      {month: 'Mar', avgTemp: 6.3, iceCreamSales: 302000},
      {month: 'May', avgTemp: 16.2, iceCreamSales: 800000},
      {month: 'Jul', avgTemp: 22.8, iceCreamSales: 1254000},
      {month: 'Sep', avgTemp: 14.5, iceCreamSales: 950000},
      {month: 'Nov', avgTemp: 8.9, iceCreamSales: 200000},
    ],
    // Series: Defines which chart type and data to use
    series: [{type: 'bar', xKey: 'month', yKey: 'iceCreamSales'}]
  };

  constructor(private sensorChartService: SensorChartService) {}

  ngOnInit(): void {
    this.sensorChartService.sensorData$.subscribe((data) => {
      this.sensorData = data;

    });
  }
}
