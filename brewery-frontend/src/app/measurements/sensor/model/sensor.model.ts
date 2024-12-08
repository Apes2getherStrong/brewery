export enum SENSOR_TYPE {
  TEMPERATURE = 'TEMPERATURE',
  ALCOHOL_CONTENT_PERCENT = 'ALCOHOL_CONTENT_PERCENT',
  PRESSURE = 'PRESSURE',
  PH = "PH"
}

export interface SensorData {
  //id: String | undefined; //UUID
  sensorType: SENSOR_TYPE;
  sensorNr: number; //1-16
  value: number; //double / float?
  dateTime: Date; //"2024-12-04T12:34:56.789Z"
}
