import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {AgGridAngular} from 'ag-grid-angular';
import {ColDef, GridApi, GridReadyEvent} from 'ag-grid-community';
import {ThemeService} from '../../../service/theme.service';
import {SensorData} from '../../sensor/model/sensor.model';
import '@ag-grid-community/styles/ag-theme-quartz.css';
import '@ag-grid-community/styles/ag-theme-quartz.min.css';
import '@ag-grid-community/styles/ag-grid.css';


@Component({
  selector: 'app-sensor-table',
  standalone: true,
  imports: [
    AgGridAngular
  ],
  templateUrl: './sensor-table.component.html',
  styleUrl: './sensor-table.component.css'
})
export class SensorTableComponent implements OnInit {

  themeClass = 'ag-theme-quartz-dark';

  @Input() rowData: SensorData[] | null = null;
  @Input() columnDefs: ColDef[] = [];
  @Input() defaultColDef: ColDef = {};
  @Input() pagination = true;
  @Input() paginationPageSize = 500;
  @Input() paginationPageSizeSelector = [10, 25, 50];

  @Output() filterChanged = new EventEmitter<void>();
  @Output() sortChanged = new EventEmitter<void>();
  @Output() gridReady = new EventEmitter<GridApi>();
  @Output() firstDataRendered = new EventEmitter<void>();

  private gridApi!: GridApi;

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.themeService.isDarkMode$.subscribe((isDarkMode) => {
      //this.themeClass = isDarkMode ? 'ag-theme-quartz-dark' : 'ag-theme-alpine';
    });
  }


  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
    this.gridReady.emit(this.gridApi);
  }

  onFilterChanged(): void {
    this.filterChanged.emit();
  }

  onSortChanged(): void {
    this.sortChanged.emit();
  }

  onFirstDataRendered(): void {
    this.firstDataRendered.emit();
  }
}
