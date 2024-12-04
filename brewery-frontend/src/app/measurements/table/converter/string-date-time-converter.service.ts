import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StringDateTimeConverterService {

  getStringDateFromDateTimeKebab(dateTime: Date): String {
    const year = dateTime.getFullYear();
    const month = (dateTime.getMonth() + 1).toString().padStart(2, '0');
    const day = dateTime.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getStringTimeFromDateTimeColon(dateTime: Date): String {
    const hours = dateTime.getHours().toString().padStart(2, '0');
    const minutes = dateTime.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  getDateTimeFromStringDateAndStringTime(day: String, time:String): Date {
    const [year, month, date] = day.split('-').map(Number);
    const [hours, minutes] = time.split(':').map(Number);

    return new Date(year, month - 1, date, hours, minutes);
  }
}
