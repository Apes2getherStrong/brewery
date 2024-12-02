import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {NavigationComponent} from './navigation/navigation.component';
import {ThemeService} from './sensor/service/theme.service';


@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet, NavigationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'brewery-frontend';

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    this.themeService.loadInitialMode();
  }
}
