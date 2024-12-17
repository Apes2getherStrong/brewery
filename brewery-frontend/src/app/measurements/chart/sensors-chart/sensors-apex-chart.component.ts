import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
import {ChartComponent, NgApexchartsModule} from 'ng-apexcharts';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexTitleSubtitle,
  ApexXAxis,
  ApexTooltip,
  ApexTheme
} from "ng-apexcharts";

import {SENSOR_TYPE, SensorData} from '../../sensor/model/sensor.model';
import {ThemeService} from '../../../service/theme.service';



@Component({
  selector: 'app-sensors-chart',
  imports: [NgApexchartsModule, ChartComponent],
  standalone: true,
  templateUrl: './sensors-apex-chart.component.html',
  styleUrl: './sensors-apex-chart.component.css'
})
export class SensorsApexChartComponent implements OnInit{

  @Input() sensorData: SensorData[] | null = null;

  public series: ApexAxisChartSeries;
  public chart: ApexChart;
  public title: ApexTitleSubtitle;
  public xaxis: ApexXAxis;
  public tooltip: ApexTooltip;
  public theme: ApexTheme;

  constructor(private themeService: ThemeService) {
    this.theme = {
      mode: 'light',
      palette: 'palette2'
    }
    this.series = [];
    this.chart = {
      background: "#1b263b",
      type: 'area',
      height: 350,
      zoom: {
        type: 'x',
        enabled: true,
        autoScaleYaxis: true,
      },
      toolbar: {
        autoSelected: 'zoom',
      }
    };
    this.title = {
      text: 'Sensor Data Visualization',
      align: 'left',
    };
    this.xaxis = {
      type: 'datetime',
    };
    this.tooltip = {
      x: {
        format: 'dd MMM yyyy HH:mm:ss',
      },
    };
  }

  ngOnInit(): void {
    this.themeService.isDarkMode$.subscribe((isDarkMode) => {
      if(isDarkMode) {
        this.theme = {
          mode: 'dark',
          palette: 'palette2'
        }
        this.chart.background = "#1b263b";
      }
      else {
        this.theme = {
          mode: 'light',
          palette: 'palette2'
        }
        this.chart.background = "#344e41";
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['sensorData'] && this.sensorData) {
      this.updateChart(this.sensorData);
    }
  }

  private updateChart(data: SensorData[]): void {
    const groupedData = this.groupDataBySensorType(data);

    this.series = Object.keys(groupedData).map(sensorType => ({
      name: this.getSensorTypeTitle(sensorType as SENSOR_TYPE),
      data: groupedData[sensorType]
        .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())  // Sort by dateTime
        .map(item => [
          new Date(item.dateTime).getTime(),  // Convert string to timestamp
          item.value
        ])
    }));
  }

  private groupDataBySensorType(data: SensorData[]): Record<string, SensorData[]> {
    return data.reduce((acc, item) => {
      if (!acc[item.sensorType]) {
        acc[item.sensorType] = [];
      }
      acc[item.sensorType].push(item);
      return acc;
    }, {} as Record<string, SensorData[]>);
  }

  private getSensorTypeTitle(sensorType: SENSOR_TYPE): string {
    switch (sensorType) {
      case SENSOR_TYPE.TEMPERATURE:
        return 'Temperature';
      case SENSOR_TYPE.ALCOHOL_CONTENT_PERCENT:
        return 'Alcohol Content';
      case SENSOR_TYPE.PRESSURE:
        return 'Pressure';
      case SENSOR_TYPE.PH:
        return 'pH Level';
      default:
        return 'Unknown';
    }
  }
}
