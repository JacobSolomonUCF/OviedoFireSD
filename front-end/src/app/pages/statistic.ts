import {Component, ElementRef, ViewChild} from "@angular/core";
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
				<select [(ngModel)]="index" (change)="switchTo()" *ngIf="original[index].title.length">
					<option *ngFor="let data of original; index as i" [value]="i">{{data.title}}</option>
				</select>
				<select [(ngModel)]="level" (change)="switchTo()" *ngIf="original[index].details.length">
					<option *ngFor="let time of original[index].details; index as i" [value]="i">{{time}}</option>
				</select>

				<canvas #myChart
								baseChart
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

	@ViewChild('myChart') myChart: ElementRef;

	loading = true;
	public barChartOptions: any = {
		scaleShowVerticalLines: false,
		responsive: true,
		scales: {
			yAxes: [{
				display: true,
				ticks: {
					beginAtZero: true,
					suggestedMax: 10
				}
			}]
		}
	};
	public barChartLabels: string[] = [];
	public barChartType: string = 'bar';
	public barChartLegend: boolean = true;
	public index: number = 0;
	public level: number = 0;
	public original: any[];
	public barChartData: any[] = [];

	constructor(webService: WebService) {
		webService.setState('statistics')
			.doGet('/statistics')
			.subscribe(resp => {
				if (resp['results'] && resp['results'][0]) {
					let overall = {title: 'Overall'};
					for (let i = 0, results = resp['results'], len = results.length; i < len; i++) {
						results[i].details.forEach(time => {
							let report = JSON.parse(JSON.stringify(results[i].title.split(' - ', 1)[0]));
							if (!overall[time]) {
								overall[time] = JSON.parse(JSON.stringify(results[i][time]));
								overall[time].labels[0] = report;
								overall['details'] = [time];
							} else {
								let index = overall[time].labels.indexOf(report);
								if (index === -1) {
									overall[time].labels.push(report);
									[0, 1, 2].map(dataIndex =>
										overall[time].data[dataIndex].data.push(results[i][time].data[dataIndex].data.reduce((x, y) => x + y)));
								} else {
									[0, 1, 2].map(dataIndex =>
										overall[time].data[dataIndex].data[index] += (results[i][time].data[dataIndex].data.reduce((x, y) => x + y)));
								}
							}
						});
					}
					resp['results'].unshift(overall);
					let result = {...resp['results'][0][resp['results'][0].details[0]]};
					this.original = resp['results'];
					this.barChartLabels = [...result.labels];
					if (!result.data) result.data = this.barChartLabels.map(label => {
						return {label: label, data: [0]}
					});
					this.barChartData = [...result.data];
				} else {
					this.original = [{title: '', details: []}];
					this.barChartLabels = ['Nothing here'];
					this.barChartData = [{label: 'Nothing here', data: [0, 0]}];
				}
			}, () => {
				this.loading = false;
			}, () => {
				this.loading = false;
			})
		;
	}

	switchTo(retry = false) {
		this.barChartLabels.length = 0;
		let time = this.original[this.index].details[this.level];
		if (!time) {
			this.level = 0;
			return retry ? false : this.switchTo(true);
		}
		let data = this.original[this.index][time];
		data.labels.forEach(label => {
			this.barChartLabels.push(label);
		});
		this.barChartData = data.data;
	}
}
