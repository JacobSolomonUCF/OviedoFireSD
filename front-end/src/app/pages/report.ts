import {Component, ViewChild} from "@angular/core";
import {WebService} from "../services/webService";
import {saveAs} from 'file-saver';

@Component({
	template: `
		<div class="header">
			<h1>{{title ? title : 'Week of ' + date}}</h1>
		</div>

		<div class="content" [ngSwitch]="loading">
			<div *ngSwitchCase="true" class="centered">
				<i class="fa fa-5x fa-spinner fa-pulse"></i>
			</div>
			<div *ngSwitchCase="false">
				<div [ngSwitch]="viewType">
					<div class="table-options" *ngSwitchCase="'view'">
						<div class="left">
							<datepicker #datepicker></datepicker>
							<button class="close" (click)="getReports(datepicker.input.nativeElement.value)"
											[disabled]="reloading || datepicker.input.nativeElement.value === date">
								<i class="fa fa-refresh {{reloading ? 'fa-spin' : ''}}"></i>
							</button>
						</div>
						<div class="right">
							<input
								#tableFilterView
								class='filter'
								type='text'
								[ngModel]="filter"
								placeholder='Type to filter...'
								(keyup)='filter = tableFilterView.value; updateFilter($event)'/>
						</div>
					</div>
					<div class="table-options" *ngSwitchCase="'edit'">
						<div class="left">
							<button class="close" (click)="toggle()">
								<i class="fa fa-chevron-left"></i> Back
							</button>
							<button class="close green" (click)="download()">
								<i class="fa fa-download"></i> export
							</button>
						</div>
						<div class="right {{style.days.length ? '' : 'no-grow'}}" [ngSwitch]="style.days.length">
							<div class="alert alert-warning" *ngSwitchCase="0">This report has not been started!</div>
							<input
								*ngSwitchDefault
								#tableFilter
								class='filter'
								type='text'
								[ngModel]="filter"
								placeholder='Type to filter...'
								(keyup)='filter = tableFilter.value; updateFilter($event)'/>
						</div>
					</div>
				</div>
				<div>
					<ngx-datatable
						#myTable
						*ngIf="!row"
						class='table'
						[rows]="reports"
						[groupRowsBy]="style.group"
						[columnMode]="'flex'"
						[scrollbarH]="false"
						[footerHeight]="0"
						[rowHeight]="'auto'"
						(select)="onclick($event, myTable)"
						[selectionType]="style.selectType"
						[groupExpansionDefault]="true">
						<!-- Group Header Template -->
						<ngx-datatable-group-header [rowHeight]="'auto'" #myGroupHeader>
							<ng-template let-group="group" let-expanded="expanded" ngx-datatable-group-header-template>
								<div style="padding-left:5px;" (click)="toggleExpandGroup(group)">
									<span title="Expand/Collapse Group">
										<b>{{group.value[0][style.group]}}</b>
									</span>
								</div>
							</ng-template>
						</ngx-datatable-group-header>
						<ngx-datatable-column [name]="style.thing"
																	[prop]="(style.thingProp) ? style.thingProp : style.thing"
																	[flexGrow]="3"
																	[resizeable]="false"
																	[sortable]="false"></ngx-datatable-column>
						<ngx-datatable-column *ngFor="let day of style.days"
																	[name]="day[0]"
																	[prop]="day"
																	[flexGrow]="1"
																	[resizeable]="false"
																	[sortable]="false">
							<ng-template ngx-datatable-cell-template let-rowIndex="rowIndex" let-value="value" let-row="row"
													 let-group="group">
								<div class="hasTooltip">
									<i *ngIf="!value" class="fa fa-minus"></i>
									<i *ngIf="value"
										 class="fa {{getCheckBox(value.result)}}">{{getCheckBox(value.result) === ''
										? value.result
										: ''}}</i>
									<span *ngIf="value['completedBy']" class="tooltip-text">
										{{"'" + (value['note'] ? value['note'] : value.result) + "' "}}{{value['completedBy']}}
									</span>
								</div>
							</ng-template>
						</ngx-datatable-column>
						<ngx-datatable-column *ngIf="viewType === 'view'"
																	[name]="'Schedule'"
																	[prop]="'schedule'"
																	[flexGrow]="2"
																	[resizeable]="false"
																	[sortable]="false">
						</ngx-datatable-column>
					</ngx-datatable>
				</div>
			</div>
		</div>
	`
	, styleUrls: ['../menu.sass']
})
export class Report {

	@ViewChild('myTable') table: any;

	date: string;
	days: string[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
	title: string = undefined;
	filter: string = '';
	viewType: string = 'view';
	loading: boolean = true;
	reloading: boolean = true;
	filterableHeading: string[] = ['name', 'schedule', 'status', 'id'];

	temp;
	report;
	original;
	reports: any[];
	webService: WebService;

	styles = {
		edit: {
			group: false,
			days: [],
			thing: undefined,
			thingProp: undefined,
			props: [],
			select: () => {
			},
			selectType: 'single'
		},
		view: {
			group: 'status',
			days: [],
			thing: 'report',
			thingProp: 'name',
			props: [{name: 'schedule'}],
			select: (e, m) => {
				return this.onclick(e, m);//this.openDialog(e, m);
			},
			selectType: 'single'
		},
		modal: {
			group: 'compartment',
			days: [
				'sunday',
				'monday',
				'tuesday',
				'wednesday',
				'thursday',
				'friday',
				'saturday'],
			thing: 'item',
			props: [],
			select: () => {
			},
			selectType: 'single'
		}
	};
	style: any;
	previousStyle: any;

	constructor(webService: WebService) {
		this.webService = webService.setState('reports');

		this.doGet();
	}

	toggle() {
		this.viewType = 'view';
		this.style = (this.previousStyle) ? this.previousStyle : this.style;
		this.table.rows = this.reports;
		this.title = '';
		delete this.temp;
		delete this.previousStyle;
		this.updateFilter(undefined);
	}

	updateFilter(event) {
		let val = (!event) ? '' : event.target.value.toLowerCase();
		const source = this.temp ? this.temp : {rows: this.original, heading: this.filterableHeading};

		if (!event) this.filter = "";

		this.reports = (!event) ?
			this.original : source.rows.filter(row => {
				for (let i = 0, len = (!val ? 1 : source.heading.length); i < len; i++)
					if (val == '' || (row[source.heading[i]]).toLowerCase().indexOf(val) !== -1)
						return true;
				return false;
			});
	}

	onclick(event, m) {
		if (this.viewType == 'edit')
			return;
		this.viewType = 'edit';
		this.filter = '';
		this.previousStyle = this.style;
		this.title = event.selected[0].name;
		this.report = event.selected[0];
		this.reports = m.rows = (this.temp = {
			rows: event.selected[0].data.rows,
			heading: event.selected[0].data.heading,
			days: event.selected[0].days
		}).rows;
		this.style = this.styles.modal;
		this.style.days = this.days.filter(day => {
			if (this.temp.days[day]) return day;
		});
		this.style.report = event.selected[0].name;
	}

	ngOnInit() {
		this.style = this.styles['view'];
		let date = new Date();
		this.date = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
	}

	getCheckBox(status) {
		let options = {
			Present: 'fa-lg fa-check',
			Pass: 'fa-lg fa-check',
			Passed: 'fa-lg fa-check',
			Missing: 'fa-lg fa-question box-missing',
			Fail: 'fa-lg fa-close box-broken',
			Failed: 'fa-lg fa-close box-broken',
			"Repairs Needed": 'fa-lg fa-close box-broken',
			other: 'fa-minus'
		};
		return (options[status]) ? options[status] : (status.length) ? '' : options.other;
	};

	download() {
		this.webService
			.doPost('/downloadReport', {report: this.report}, '?date=' + this.formatDate())
			.subscribe(resp => {
				let file = new Blob([resp], {type: 'text/csv; charset=utf-8'});
				saveAs(file, this.report.name + '(' + this.date + ')' + '.csv')
			}, error => {
				let file = new Blob([`Column, Column, Column, Column
Row, Cell, Cell, Cell
Row, Cell, Cell, Cell
Row, wait, a, second
Error:,${error.name},${error.statusText},${error.message}`], {type: 'text/csv;charset=utf-8'});
				saveAs(file, 'yourFile.csv')
			});
	}

	doGet(date = undefined) {
		this.webService
			.doGet('/reports', (date) ? '&date=' + date : '')
			.subscribe((resp) => {
				this.original = this.reports = resp['reports'].map((r) => {
					if (r.schedule === 'Daily') {
						let title = r.name + ' - ';
						for (let i = 0, len = r.data.rows.length; i < len; i++)
							if (r.data.rows[i].compartment.indexOf(title) !== -1)
								r.data.rows[i].compartment = r.data.rows[i].compartment.substring(title.length);
					}
					return r;
				});
			}, error => {
				this.loading = false;
				this.reloading = false;
			}, () => {
				this.loading = false;
				this.reloading = false;
			})
		;
	}

	formatDate(dateParts = this.date.split('/')) {
		return dateParts[2] + this.pad(dateParts[0]) + this.pad(dateParts [1])
	}

	getReports(datepicker = this.date) {
		if (datepicker === this.date)
			return;
		this.date = datepicker;
		let self = this;
		let date = this.formatDate();
		self.reloading = true;

		this.doGet(date);
	}

	pad(x: string) {
		return ((x.length === 1) ? '0' : '') + x;
	}

	toggleExpandGroup(group, table = this.table) {
		table.groupHeader.toggleExpandGroup(group);
	}
}
