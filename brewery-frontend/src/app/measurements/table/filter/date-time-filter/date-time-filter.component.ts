import {Component, ElementRef, ViewChild} from '@angular/core';
import {IFilterAngularComp} from '@ag-grid-community/angular';
import { IFilterParams, AgPromise, IDoesFilterPassParams, IAfterGuiAttachedParams } from '@ag-grid-community/core';
import {FormsModule} from '@angular/forms';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import {MatFormField, MatLabel, MatSuffix} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatTimepicker, MatTimepickerInput, MatTimepickerToggle} from '@angular/material/timepicker';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-date-time-filter',
  standalone: true,
  imports: [
    FormsModule,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatFormField,
    MatInput,
    MatLabel,
    MatSuffix,
    MatTimepicker,
    MatTimepickerInput,
    MatTimepickerToggle,
    CommonModule
  ],
  templateUrl: './date-time-filter.component.html',
  styleUrl: './date-time-filter.component.css'
})
export class DateTimeFilterComponent implements IFilterAngularComp {

  // Input date and time
  startDate: Date | null = null;
  startTime: Date | null = null;
  endDate: Date | null = null;
  endTime: Date | null = null;

  //params for filter operations
  filterParams!: IFilterParams;

  agInit(params: IFilterParams<any, any>): void {
    this.filterParams = params;
  }

  // Return true if the filter is active. If active then
  // 1) the grid will show the filter icon in the column
  // header and 2) the filter will be included in the filtering of the data.
  isFilterActive(): boolean {
    return this.startDate != null && this.endDate != null && this.startTime != null && this.endTime != null;
  }

  doesFilterPass(params: IDoesFilterPassParams): boolean {
    const { node } = params;
    const rowDate: Date | null | undefined = this.filterParams.getValue(node);

    if (!rowDate || !(rowDate instanceof Date)) {
      return false; // Ensure the row value is a Date
    }

    // Combine start date/time and end date/time for comparison
    const startDateTime = this.combineDateTime(this.startDate, this.startTime);
    const endDateTime = this.combineDateTime(this.endDate, this.endTime);

    // Check if the row's date is within the selected range
    if (startDateTime && endDateTime) {
      console.log( rowDate)
      console.log( startDateTime)
      console.log( endDateTime)
      console.log(rowDate >= startDateTime && rowDate <= endDateTime)

      return rowDate >= startDateTime && rowDate <= endDateTime;

    }

    return false;
  }

  // Combine date and time into a single Date object
  combineDateTime(date: Date | null, time: Date | null): Date | null {
    if (date && time) {
      const combined = new Date(date);
      combined.setHours(time.getHours());
      combined.setMinutes(time.getMinutes());
      combined.setSeconds(time.getSeconds());
      return combined;
    }
    return null;
  }

  // Gets the filter state. If filter is not active, then should return null/undefined.
  // The grid calls getModel() on all active filters when gridApi.getFilterModel() is called.
  getModel() {
    if (!this.isFilterActive()) {
      return null;
    }

    return {
      startDate: this.startDate,
      startTime: this.startTime,
      endDate: this.endDate,
      endTime: this.endTime
    };
  }

  // Restores the filter state. Called by the grid after gridApi.setFilterModel(model) is called.
  // The grid will pass undefined/null to clear the filter.
  setModel(model: any): void | AgPromise<void> {
    if (model) {
      this.startDate = model.startDate ? new Date(model.startDate) : null;
      this.startTime = model.startTime ? new Date(model.startTime) : null;
      this.endDate = model.endDate ? new Date(model.endDate) : null;
      this.endTime = model.endTime ? new Date(model.endTime) : null;
    } else {
      this.startDate = null;
      this.startTime = null;
      this.endDate = null;
      this.endTime = null;
    }
  }

  //TODO understand
  onDateChanged() {
    this.filterParams.filterChangedCallback();
  }

  // If floating filters are turned on for the grid, but you have no floating filter
  // configured for this column, then the grid will check for this method. If this
  // method exists, then the grid will provide a read-only floating filter for you
  // and display the results of this method. For example, if your filter is a simple
  // filter with one string input value, you could just return the simple string
  // value here
  getModelAsString(model: any): string {
    if (model) {
      const start = model.startDate ? new Date(model.startDate).toLocaleString() : 'N/A';
      const end = model.endDate ? new Date(model.endDate).toLocaleString() : 'N/A';
      return `From: ${start}, To: ${end}`;
    }
    return '';
  }

  /*refresh?(newParams: IFilterParams): boolean {
      throw new Error('Method not implemented.');
  }
  onNewRowsLoaded?(): void {
      throw new Error('Method not implemented.');
  }
  onAnyFilterChanged?(): void {
      throw new Error('Method not implemented.');
  }
  getModelAsString?(model: any): string {
      throw new Error('Method not implemented.');
  }
  afterGuiAttached?(params?: IAfterGuiAttachedParams): void {
      throw new Error('Method not implemented.');
  }
  afterGuiDetached?(): void {
      throw new Error('Method not implemented.');
  }*/

}
