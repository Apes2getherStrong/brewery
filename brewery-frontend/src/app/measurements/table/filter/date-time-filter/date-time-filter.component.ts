import {Component, ElementRef, ViewChild} from '@angular/core';
import {IFilterAngularComp} from '@ag-grid-community/angular';
import { IFilterParams, AgPromise, IDoesFilterPassParams, IAfterGuiAttachedParams } from '@ag-grid-community/core';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-date-time-filter',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './date-time-filter.component.html',
  styleUrl: './date-time-filter.component.css'
})
export class DateTimeFilterComponent implements IFilterAngularComp {

    //input
    @ViewChild('eFilterText') eFilterText!: ElementRef;
    filterText = '';

    //params for filter operations
    filterParams!: IFilterParams;

    agInit(params: IFilterParams<any, any>): void {
      this.filterParams = params;
    }

    // Return true if the filter is active. If active then
    // 1) the grid will show the filter icon in the column
    // header and 2) the filter will be included in the filtering of the data.
    isFilterActive(): boolean {
      return this.filterText != null && this.filterText !== '';
    }

    doesFilterPass(params: IDoesFilterPassParams): boolean {
      // make sure each word passes separately, ie search for firstname, lastname
      const { node } = params;

      const value = this.filterParams.getValue(node);
      if(value.toString() == this.filterText) {
        return true;
      }
      return false;
    }

    // Gets the filter state. If filter is not active, then should return null/undefined.
    // The grid calls getModel() on all active filters when gridApi.getFilterModel() is called.
    getModel() {
      if (!this.isFilterActive()) {
        return null;
      }

      return { value: this.filterText };
    }

    // Restores the filter state. Called by the grid after gridApi.setFilterModel(model) is called.
    // The grid will pass undefined/null to clear the filter.
    setModel(model: any): void | AgPromise<void> {
      this.filterText = model == null ? null : model.value;
    }

    //TODO understand
    onInputChanged() {
      this.filterParams.filterChangedCallback();
    }

    // If floating filters are turned on for the grid, but you have no floating filter
    // configured for this column, then the grid will check for this method. If this
    // method exists, then the grid will provide a read-only floating filter for you
    // and display the results of this method. For example, if your filter is a simple
    // filter with one string input value, you could just return the simple string
    // value here
    getModelAsString?(model: any): string {
      return "AFUHRF";
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
