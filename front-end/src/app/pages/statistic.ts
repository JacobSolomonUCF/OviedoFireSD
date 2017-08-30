import {Component} from "@angular/core";

@Component({
  template: `
    <div class="header">
      <h1>Statistics</h1>
    </div>

    <div class="content">
      <canvas baseChart
              [datasets]="barChartData"
              [labels]="barChartLabels"
              [options]="barChartOptions"
              [legend]="barChartLegend"
              [chartType]="barChartType"></canvas>
    </div>
  `
  , styleUrls: ['../menu.sass']
})
export class Statistic {

  public barChartOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels:string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public barChartType:string = 'bar';
  public barChartLegend:boolean = true;

  public barChartData:any[] = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Broken'},
    {data: [28, 48, 40, 19, 86, 27, 90], label: 'Needs Repair'},
    {data: [8,  18, 20, 29, 23, 47, 44], label: 'Missing'}
  ];
}
