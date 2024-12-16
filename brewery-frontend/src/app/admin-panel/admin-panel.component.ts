import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForOf } from '@angular/common';
import { SensorInfo } from '../measurements/sensor/model/sensor-info.model';
import { SensorService } from '../measurements/sensor/service/sensor.service';
import { Subscription, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [NgForOf],
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit, OnDestroy {
  sensorsInfo: SensorInfo[] = Array.from({ length: 16 }, (_, i) => ({
    sensorNr: i + 1,
    balance: 0,
    address: '-'
  }));

  private refreshSubscription!: Subscription;

  constructor(private sensorService: SensorService) {}

  ngOnInit(): void {
    this.refreshSubscription = interval(1000)
      .pipe(
        switchMap(() => this.sensorService.getSensorsInfo())
      )
      .subscribe({
        next: (info) => {
          this.sensorsInfo = info;
        },
        error: (err) => console.error('Failed to refresh sensor info', err)
      });
  }

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }
}
