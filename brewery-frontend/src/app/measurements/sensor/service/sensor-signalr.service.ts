import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class SensorSignalRService {
  private connection: signalR.HubConnection;

  constructor() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5000/sensorHub')
      .withAutomaticReconnect()
      .build();
  }


  startConnection(): void {
    this.connection
      .start()
      .then(() => {
        console.log('[SignalR] connected');
      })
      .catch(err => {
        console.error('[SignalR] connection error', err);
      });
  }


  onSensorDataReceived(callback: (sensorData: any) => void): void {
    this.connection.on('ReceiveSensorData', callback);
  }

  stopConnection(): void {
    if (this.connection) {
      this.connection
        .stop()
        .then(() => console.log('[SignalR] connection stopped'))
        .catch(err => console.error('[SignalR] Error stopping SignalR connection:', err));
    }
  }
}
