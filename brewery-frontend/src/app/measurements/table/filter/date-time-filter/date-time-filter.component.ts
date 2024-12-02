import { Component } from '@angular/core';
import { IFilterAngularComp } from '@ag-grid-community/angular';
import { IFilterParams, AgPromise, IDoesFilterPassParams } from '@ag-grid-community/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-date-time-filter',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './date-time-filter.component.html',
  styleUrls: ['./date-time-filter.component.css']
})
export class DateTimeFilterComponent implements IFilterAngularComp {

  // Input values for start and end date-time as strings
  startDateStr: string = "";
  startTimeStr: string = "";
  endDateStr: string = "";
  endTimeStr: string = "";

  //params for filter operations
  filterParams!: IFilterParams;

  agInit(params: IFilterParams<any, any>): void {
    this.filterParams = params;
  }

  // Return true if the filter is active. If active then
  // 1) the grid will show the filter icon in the column
  // header and 2) the filter will be included in the filtering of the data.
  isFilterActive(): boolean {
    return this.startDateStr !== "" && this.endDateStr !== "" && this.startTimeStr !== "" && this.endTimeStr !== "";
  }

  // The main filter logic for comparing rows with the date-time range
  doesFilterPass(params: IDoesFilterPassParams): boolean {
    const { node } = params;
    const rowDate: Date | null | undefined = this.filterParams.getValue(node);

    if (!rowDate || !(rowDate instanceof Date)) {
      return false; // Ensure the row value is a Date
    }

    // Combine string date and time into Date objects
    const startDateTime = this.combineDateTime(this.startDateStr, this.startTimeStr);
    const endDateTime = this.combineDateTime(this.endDateStr, this.endTimeStr);

    // Check if the row's date is within the selected range
    if (startDateTime && endDateTime) {
      return rowDate >= startDateTime && rowDate <= endDateTime;
    }

    return false;
  }

  // Combine date and time string into a Date object
  combineDateTime(dateStr: string, timeStr: string): Date | null {
    if (dateStr && timeStr) {
      const combinedDateStr = `${dateStr}T${timeStr}`;
      const combinedDate = new Date(combinedDateStr);
      return combinedDate.getTime() ? combinedDate : null;
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
      startDate: this.startDateStr,
      startTime: this.startTimeStr,
      endDate: this.endDateStr,
      endTime: this.endTimeStr
    };
  }

  // Restores the filter state. Called by the grid after gridApi.setFilterModel(model) is called.
  // The grid will pass undefined/null to clear the filter.
  setModel(model: any): void | AgPromise<void> {
    if (model) {
      this.startDateStr = model.startDate || "";
      this.startTimeStr = model.startTime || "";
      this.endDateStr = model.endDate || "";
      this.endTimeStr = model.endTime || "";
    } else {
      this.startDateStr = "";
      this.startTimeStr = "";
      this.endDateStr = "";
      this.endTimeStr = "";
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
      const start = model.startDate ? `${model.startDate} ${model.startTime}` : 'N/A';
      const end = model.endDate ? `${model.endDate} ${model.endTime}` : 'N/A';
      return `From: ${start}, To: ${end}`;
    }
    return '';
  }

  setCurrentEndDate() {
    const now = new Date();
    this.endDateStr = now.toISOString().split('T')[0]; // Set to current date (YYYY-MM-DD)
  }

  setCurrentEndTime() {
    const now = new Date();
    this.endTimeStr = now.toTimeString().split(' ')[0]; // Set to current time (HH:mm:ss)
  }

  clearFilters() {
    this.startDateStr = "";
    this.startTimeStr = "";
    this.endDateStr = "";
    this.endTimeStr = "";
    this.filterParams.filterChangedCallback();
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
