import {Component, ElementRef, ViewChild} from '@angular/core';
import {IFilterAngularComp} from '@ag-grid-community/angular';
import { IFilterParams, AgPromise, IDoesFilterPassParams, IAfterGuiAttachedParams } from '@ag-grid-community/core';
import {FormsModule} from '@angular/forms';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import {MatFormField, MatLabel, MatSuffix} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatTimepicker, MatTimepickerInput, MatTimepickerToggle} from '@angular/material/timepicker';

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
    MatTimepickerToggle
  ],
  templateUrl: './date-time-filter.component.html',
  styleUrl: './date-time-filter.component.css'
})
export class DateTimeFilterComponent implements IFilterAngularComp {

    //input
    startDate: Date | null = null;
    endDate: Date | null = null;

    //params for filter operations
    filterParams!: IFilterParams;

    agInit(params: IFilterParams<any, any>): void {
      this.filterParams = params;
    }

    // Return true if the filter is active. If active then
    // 1) the grid will show the filter icon in the column
    // header and 2) the filter will be included in the filtering of the data.
    isFilterActive(): boolean {
      return this.startDate != null && this.endDate != null;
    }

    doesFilterPass(params: IDoesFilterPassParams): boolean {
      const { node } = params;
      const rowDate: Date | null | undefined = this.filterParams.getValue(node);

      if (!rowDate || !(rowDate instanceof Date)) {
        return false; // Ensure the row value is a Date
      }

      // Check if the row's date is between startDate and endDate
      if (this.startDate && this.endDate) {
        return rowDate >= this.startDate && rowDate <= this.endDate;
      }

      return false;
    }

    // Gets the filter state. If filter is not active, then should return null/undefined.
    // The grid calls getModel() on all active filters when gridApi.getFilterModel() is called.
    getModel() {
      if (!this.isFilterActive()) {
        return null;
      }

      return {
        startDate: this.startDate,
        endDate: this.endDate
      };
    }

    // Restores the filter state. Called by the grid after gridApi.setFilterModel(model) is called.
    // The grid will pass undefined/null to clear the filter.
    setModel(model: any): void | AgPromise<void> {
      if (model) {
        this.startDate = model.startDate ? new Date(model.startDate) : null;
        this.endDate = model.endDate ? new Date(model.endDate) : null;
      } else {
        this.startDate = null;
        this.endDate = null;
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
    getModelAsString?(model: any): string {
      if (model) {
        const start = model.startDate ? new Date(model.startDate).toLocaleDateString() : 'N/A';
        const end = model.endDate ? new Date(model.endDate).toLocaleDateString() : 'N/A';
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
