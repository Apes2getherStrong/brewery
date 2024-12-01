import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private darkModeSubject = new BehaviorSubject<boolean>(false);
  isDarkMode$ = this.darkModeSubject.asObservable();

  toggleMode(isDarkMode: boolean) {
    this.darkModeSubject.next(isDarkMode);
    localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }

  loadInitialMode() {
    const savedMode = JSON.parse(localStorage.getItem('isDarkMode') || 'false');
    this.darkModeSubject.next(savedMode);
    document.documentElement.setAttribute('data-theme', savedMode ? 'dark' : 'light');
  }
}
