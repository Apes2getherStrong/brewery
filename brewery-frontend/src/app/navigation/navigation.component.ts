import { Component } from '@angular/core';
import {CommonModule, NgIf} from '@angular/common';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import { faBars, faBeerMugEmpty } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [
    NgIf,
    FontAwesomeModule,
    CommonModule,
  ],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css'
})
export class NavigationComponent {
  isDarkMode: boolean = false;
  faBars = faBars;
  faBeerMugEmpty = faBeerMugEmpty;

  toggleMode() {
    this.isDarkMode = !this.isDarkMode;
    //TODO save the mode preference in localStorage to persist the theme across sessions
    if (this.isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }
}
