import {Component} from "@angular/core";
import {WebService} from "../services/webService";

@Component({
	template: `
		<div class="header">
			<h1>Statistics</h1>
		</div>

		<div class="content" [ngSwitch]="loading">
			<div *ngSwitchCase="true" class="centered">
				<i class="fa fa-5x fa-spinner fa-pulse"></i>
			</div>
			<div *ngSwitchCase="false">
				<canvas baseChart
								[datasets]="barChartData"
								[labels]="barChartLabels"
								[options]="barChartOptions"
								[legend]="barChartLegend"
								[chartType]="barChartType"></canvas>
			</div>
		</div>
	`
	, styleUrls: ['../menu.sass']
})
export class Statistic {

	loading = true;
	public barChartOptions: any = {
		scaleShowVerticalLines: false,
		responsive: true
	};
	public barChartLabels: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
	public barChartType: string = 'bar';
	public barChartLegend: boolean = true;

	public barChartData: any[] = [];

	constructor(webService: WebService) {
		webService.setState('statistics')
			.doGet('/statistics')
			.subscribe(resp => {
				this.barChartLabels = Object.keys(resp);
				let repairsNeeded = [], missing = [];
				this.barChartLabels.map(label => {
					repairsNeeded.push(resp[label].repairsNeeded);
					missing.push(resp[label].missing);
				});
				this.barChartData.push({label: 'Needed Repair', data: repairsNeeded});
				this.barChartData.push({label: 'Missing', data: missing});
			}, () => {
			}, () => {
				this.loading = false;
			})
		;
	}
}
