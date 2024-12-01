import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {AgGridModule} from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import '@ag-grid-community/styles/ag-grid.css';
import '@ag-grid-community/styles/ag-theme-quartz.css';
import {Component, ViewEncapsulation} from '@angular/core';
import {ThemeService} from '../service/theme.service';

interface IRow {
  make: string;
  model: string;
  price: number;
  electric: boolean;
}

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule,  AgGridModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  //encapsulation: ViewEncapsulation.None,
})
export class HomeComponent {

  themeClass =
    //"ag-theme-quartz";
    "ag-theme-quartz-dark";

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    // Subscribe to theme changes
    this.themeService.isDarkMode$.subscribe((isDarkMode) => {
      this.themeClass = isDarkMode ? 'ag-theme-quartz-dark' : 'ag-theme-alpine';
    });
  }

  //https://www.ag-grid.com/javascript-data-grid/grid-size/#autoHeight
  //https://www.ag-grid.com/angular-data-grid/getting-started/



  rowData: IRow[] = [
    { make: 'Tesla', model: 'Model Y', price: 64950, electric: true },
    { make: 'Ford', model: 'F-Series', price: 33850, electric: false },
    { make: 'Toyota', model: 'Corolla', price: 29600, electric: false },
    { make: 'Mercedes', model: 'EQA', price: 48890, electric: true },
    { make: 'Fiat', model: '500', price: 15774, electric: false },
    { make: 'Nissan', model: 'Juke', price: 20675, electric: false },
    { make: 'Nissan', model: 'Juke', price: 20675, electric: false },
    { make: 'Nissan', model: 'Juke', price: 20675, electric: false },
    { make: 'Nissan', model: 'Juke', price: 20675, electric: false },
    { make: 'Nissan', model: 'Juke', price: 20675, electric: false },
    { make: 'Nissan', model: 'Juke', price: 20675, electric: false },
    { make: 'Nissan', model: 'Juke', price: 20675, electric: false },
    { make: 'Nissan', model: 'Juke', price: 20675, electric: false },
    { make: 'Nissan', model: 'Juke', price: 20675, electric: false },
    { make: 'Nissan', model: 'Juke', price: 20675, electric: false },
    { make: 'Nissan', model: 'Juke', price: 20675, electric: false },
    { make: 'Nissan', model: 'Juke', price: 20675, electric: false },
    { make: 'Nissan', model: 'Juke', price: 20675, electric: false },
    { make: 'Nissan', model: 'Juke', price: 20675, electric: false },
    { make: 'Nissan', model: 'Juke', price: 20675, electric: false },
    { make: 'Nissan', model: 'Juke', price: 20675, electric: false },
    { make: 'Nissan', model: 'Juke', price: 20675, electric: false },
    { make: 'Nissan', model: 'Juke', price: 20675, electric: false },
    { make: 'Nissan', model: 'Juke', price: 20675, electric: false },
    { make: 'Nissan', model: 'Juke', price: 20675, electric: false },
    { make: 'Nissan', model: 'Juke', price: 20675, electric: false },
    { make: 'Nissan', model: 'Juke', price: 20675, electric: false },
    { make: 'Nissan', model: 'Juke', price: 20675, electric: false },
    { make: 'Nissan', model: 'Juke', price: 20675, electric: false },
    { make: 'Nissan', model: 'Juke', price: 20675, electric: false },
    { make: 'Nissan', model: 'Juke', price: 20675, electric: false },
    { make: 'Nissan', model: 'Juke', price: 20675, electric: false },
    { make: 'Nissan', model: 'Juke', price: 20675, electric: false },
    { make: 'Nissan', model: 'Juke', price: 20675, electric: false },
    { make: 'Nissan', model: 'Juke', price: 20675, electric: false },
    { make: 'Nissan', model: 'Juke', price: 20675, electric: false },
    { make: 'Nissan', model: 'Juke', price: 20675, electric: false },
    { make: 'Nissan', model: 'Juke', price: 20675, electric: false },
    { make: 'Nissan', model: 'Juke', price: 20675, electric: false },
    { make: 'Nissan', model: 'Juke', price: 20675, electric: false },
    { make: 'Nissan', model: 'Juke', price: 20675, electric: false },
    { make: 'Nissan', model: 'Juke', price: 20675, electric: false },
    { make: 'Nissan', model: 'Juke', price: 20675, electric: false },
    { make: 'Nissan', model: 'Juke', price: 20675, electric: false },
    { make: 'Nissan', model: 'Juke', price: 20675, electric: false },
    { make: 'Nissan', model: 'Juke', price: 20675, electric: false },
    { make: 'Nissan', model: 'Juke', price: 20675, electric: false },
    { make: 'Nissan', model: 'Juke', price: 20675, electric: false },
    { make: 'Nissan', model: 'Juke', price: 20675, electric: false },
    { make: 'Nissan', model: 'Juke', price: 20675, electric: false },
    { make: 'Nissan', model: 'Juke', price: 20675, electric: false },
    { make: 'Nissan', model: 'Juke', price: 20675, electric: false },
    { make: 'Nissan', model: 'Juke', price: 20675, electric: false },
    { make: 'Nissan', model: 'Juke', price: 20675, electric: false },
    { make: 'Nissan', model: 'Juke', price: 20675, electric: false },
    { make: 'Nissan', model: 'Juke', price: 20675, electric: false },
    { make: 'Nissan', model: 'Juke', price: 20675, electric: false },
    { make: 'Nissan', model: 'Juke', price: 20675, electric: false },
  ];

  colDefs: ColDef<IRow>[] = [{ field: 'make' }, { field: 'model' }, { field: 'price' }, { field: 'electric' }];

  defaultColDef: ColDef = {
    flex: 1,
    filter: true,
    floatingFilter: true,
  };

  pagination = true;
  paginationPageSize = 500;
  paginationPageSizeSelector = [10, 25, 50];

}
