import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CsvToJsonConverterService {
  convertCsvToJson(csvData: string): Record<string, string>[] {
    const lines = csvData.split('\n');
    const headers = lines[0].split(',');

    return lines.slice(1).filter(line => line.trim()).map((line) => {
      const values = line.split(',');

      const cleanedValues = values.map(value => value.replace(/^"|"$/g, '').trim());
      const cleanedHeaders = headers.map(header => header.replace(/[\\"]+/g, '').trim());

      return cleanedHeaders.reduce((acc, header, index) => {
        acc[header] = cleanedValues[index] || '';
        return acc;
      }, {} as Record<string, string>);
    });
  }




}
