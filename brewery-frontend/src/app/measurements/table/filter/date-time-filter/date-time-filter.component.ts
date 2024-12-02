import { Component } from '@angular/core';
import {IFilterAngularComp} from '@ag-grid-community/angular';
import { IFilterParams, AgPromise, IDoesFilterPassParams, IAfterGuiAttachedParams } from '@ag-grid-community/core';

@Component({
  selector: 'app-date-time-filter',
  standalone: true,
  imports: [],
  templateUrl: './date-time-filter.component.html',
  styleUrl: './date-time-filter.component.css'
})
export class DateTimeFilterComponent implements IFilterAngularComp {
    agInit(params: IFilterParams<any, any>): void {
        throw new Error('Method not implemented.');
    }
    isFilterActive(): boolean {
        throw new Error('Method not implemented.');
    }
    doesFilterPass(params: IDoesFilterPassParams): boolean {
      throw new Error('Method not implemented.');
    }
    getModel() {
        throw new Error('Method not implemented.');
    }
    setModel(model: any): void | AgPromise<void> {
        throw new Error('Method not implemented.');
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
