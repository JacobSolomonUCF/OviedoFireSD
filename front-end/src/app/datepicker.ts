import {Component, ViewChild} from '@angular/core';

/**
 * @title Datepicker Filter
 */
@Component({
  selector: 'datepicker',
  template: `    
    <mat-form-field class="example-full-width">
      <input #input matInput [matDatepickerFilter]="myFilter" [matDatepicker]="picker" placeholder="Select a day">
      <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
      <mat-datepicker #picker></mat-datepicker>
    </mat-form-field>
  `,
  styleUrls: ['./menu.sass']
})
export class Datepicker {
  @ViewChild("input") input: any;

  ngOnInit() {
    let date = new Date();
    this.input.nativeElement.value = date.getDate() +'/'+ date.getMonth() +'/'+ date.getFullYear();
  }

  getDate() {
    return this.input.nativeElement.value || '';
  }

  myFilter = (d: Date): boolean => {
    const day = d.getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  }
}
