import { Component } from '@angular/core';
import {CommonModule, NgIf} from '@angular/common';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import { faBars, faBeerMugEmpty } from '@fortawesome/free-solid-svg-icons';
import {ThemeService} from '../sensor/service/theme.service';

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

  constructor(private themeService: ThemeService) {
    this.themeService.isDarkMode$.subscribe((mode) => (this.isDarkMode = mode));
  }

  toggleMode() {
    this.isDarkMode = !this.isDarkMode;
    this.themeService.toggleMode(this.isDarkMode);
  }
}
