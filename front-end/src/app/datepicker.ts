import {Component} from '@angular/core';

/**
 * @title Datepicker Filter
 */
@Component({
  selector: 'datepicker',
  template: `
    <mat-form-field class="example-full-width">
      <input matInput [matDatepicker]="picker" placeholder="Select a day">
      <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
      <mat-datepicker #picker></mat-datepicker>
    </mat-form-field>
  `,
  styleUrls: ['./menu.sass']
})
export class Datepicker {
  myFilter = (d: Date): boolean => {
    const day = d.getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  }
}
