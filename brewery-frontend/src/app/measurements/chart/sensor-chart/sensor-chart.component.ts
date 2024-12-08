import { Component, OnInit } from '@angular/core';
import { SensorChartService } from '../service/sensor-chart-service.service';
import {SENSOR_TYPE, SensorData} from '../../sensor/model/sensor.model';
import { AgCharts } from 'ag-charts-angular';
import { AgChartOptions } from 'ag-charts-community';
import {ThemeService} from '../../../service/theme.service';

@Component({
  selector: 'app-sensor-chart',
  standalone: true,
  imports: [AgCharts],
  templateUrl: './sensor-chart.component.html',
  styleUrls: ['./sensor-chart.component.css'],
})
export class SensorChartComponent implements OnInit {
  //https://www.ag-grid.com/charts/angular/scatter-series/

  sensorData: SensorData[] | null = null;

  public chartOptions: AgChartOptions;

  constructor(private sensorChartService: SensorChartService,  private themeService: ThemeService) {
    this.chartOptions =  this.initChartOptions()
  }

  private initChartOptions(): AgChartOptions {
    return  {
      theme: 'ag-vivid-dark',
      title: {
        text: 'Sensor Data Visualization',
      },
      series: [],
      axes: [
        {
          type: 'time',
          position: 'bottom',
          title: {
            text: 'Date & Time',
          },
        },
        {
          type: 'number',
          position: 'left',
          title: {
            text: 'Sensor Value',
          },
        },
      ],
      legend: {
        position: 'bottom',
      },
    };
  }

  private switchTheme(switchToDark: boolean): void {
    const options = structuredClone(this.chartOptions);
    options.theme = switchToDark ? 'ag-vivid-dark' : 'ag-vivid';
    this.chartOptions = options;
  }

  ngOnInit(): void {

    this.themeService.isDarkMode$.subscribe((isDarkMode) => {
        this.switchTheme(isDarkMode);
    });

    this.sensorChartService.sensorData$.subscribe((data) => {
      if (data) {
        this.sensorData = data;
        this.updateChart(data);
      }
    });
  }

  private updateChart(data: SensorData[]): void {

    const options = structuredClone(this.chartOptions);

    const groupedData = this.groupDataBySensorType(data);

    options.series = Object.keys(groupedData).map(sensorType => {
      const title = this.getSensorTypeTitle(sensorType as SENSOR_TYPE);

      return {
        type: "scatter",
        title: title,
        data: groupedData[sensorType],
        xKey: "dateTime",
        xName: "Date & Time",
        yKey: "value",
        yName: "Sensor Value",
        labelKey: "sensorType",
        labelName: "Sensor Type"
      };
    });

    this.chartOptions = options;

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
        return "Temperature Data";
      case SENSOR_TYPE.ALCOHOL_CONTENT_PERCENT:
        return "Alcohol Content";
      case SENSOR_TYPE.PRESSURE:
        return "Pressure Data";
      case SENSOR_TYPE.PH:
        return "pH Level";
      default:
        return "Unknown Data";
    }
  }
}