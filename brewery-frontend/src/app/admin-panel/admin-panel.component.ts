import { Component } from '@angular/core';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css'
})
export class AdminPanelComponent {
  items = Array.from({ length: 16 }, (_, i) => i + 1);
}
