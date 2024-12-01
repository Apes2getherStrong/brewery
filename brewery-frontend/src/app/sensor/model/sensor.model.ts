export enum SENSOR_TYPE {
  TEMPERATURE = 'TEMPERATURE',
  HUMIDITY = 'HUMIDITY',
  PRESSURE = 'PRESSURE',
}

export interface SensorData {
  sensorType: SENSOR_TYPE;
  sensorNr: number;
  value: number;
  dateTime: Date;
}
