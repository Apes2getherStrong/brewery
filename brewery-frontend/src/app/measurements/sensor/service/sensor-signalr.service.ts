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
        console.log('Połączono z SignalR');
      })
      .catch(err => {
        console.error('Błąd połączenia z SignalR:', err);
      });
  }


  onSensorDataReceived(callback: (sensorData: any) => void): void {
    this.connection.on('ReceiveSensorData', callback);
  }
}
