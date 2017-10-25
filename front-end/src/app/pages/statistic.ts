import {Component} from "@angular/core";
import {WebService} from "../services/webService";

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

	public barChartOptions: any = {
		scaleShowVerticalLines: false,
		responsive: true
	};
	public barChartLabels: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
	public barChartType: string = 'bar';
	public barChartLegend: boolean = true;

	public barChartData: any[] = [
		{data: [65, 59, 66, 60, 56, 55, 53], label: 'Broken'},
		{data: [50, 48, 52, 30, 10, 15, 12], label: 'Missing'},
	];

	// {data: [2650, 2590, 2660, 2600, 2560, 2550, 2253], label: 'Okay'}

	constructor(webService: WebService) {
		webService.setState('statistics');
		//   .doGet('/statistics').subscribe(resp => {
		//     console.log(resp);
		// })
		// ;
	}
}
