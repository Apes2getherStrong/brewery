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

  public maleHeightWeight = [
    {
      height: 174,
      weight: 65.6,
      age: 21,
    },
    {
      height: 175.3,
      weight: 71.8,
      age: 23,
    },
    {
      height: 193.5,
      weight: 80.7,
      age: 28,
    },
  ]

  public femaleHeightWeight = [
    {
      height: 161.2,
      weight: 51.6,
      age: 22,
    },
    {
      height: 167.5,
      weight: 59,
      age: 20,
    },
    {
      height: 159.5,
      weight: 49.2,
      age: 19,
    },
  ]



  public chartOptions: AgChartOptions = {

    theme: 'ag-vivid-dark',
    title: {
      text: "Weight vs Height",
    },
    subtitle: {
      text: "by gender",
    },
    series: [
      {
        type: "scatter",
        title: "Male",
        data: this.maleHeightWeight,
        xKey: "height",
        xName: "Height",
        yKey: "weight",
        yName: "Weight",
      },
      {
        type: "scatter",
        title: "Female",
        data: this.femaleHeightWeight,
        xKey: "height",
        xName: "Height",
        yKey: "weight",
        yName: "Weight",
      },
    ],
    axes: [
      {
        type: "number",
        position: "bottom",
        title: {
          text: "Height",
        },
        label: {
          formatter: (params) => {
            return params.value + "cm";
          },
        },
      },
      {
        type: "number",
        position: "left",
        title: {
          text: "Weight",
        },
        label: {
          formatter: (params) => {
            return params.value + "kg";
          },
        },
      },
    ],
  };

  constructor(private sensorChartService: SensorChartService) {}

  ngOnInit(): void {
    this.sensorChartService.sensorData$.subscribe((data) => {
      this.sensorData = data;

    });
  }
}
