import {Component, ViewChild} from "@angular/core";
import {WebService} from "../services/webService";

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
						</div>
						<div class="right" [ngSwitch]="style.days.length">
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
					<!-- reports -->
					<!-- TODO: Download report (csv). -->
					<!-- TODO: Look into tooltip comments. -->
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
								<div style="padding-left:5px;"
										 (click)="toggleExpandGroup(group)">
              <span
								title="Expand/Collapse Group">
                <b><i class="fa {{expanded ? 'fa-chevron-down' : 'fa-chevron-right'}}" style="font-size: .7em"></i>&nbsp;{{group.value[0][style.group]}}</b>
              </span>
								</div>
							</ng-template>
						</ngx-datatable-group-header>
						<ngx-datatable-column [name]="style.thing"
																	[prop]="(style.thingProp) ? style.thingProp : style.thing"
																	[flexGrow]="3"></ngx-datatable-column>
						<ngx-datatable-column *ngFor="let x of style.days" [name]="x[0]" [prop]="x" [flexGrow]="1">
							<ng-template ngx-datatable-cell-template let-rowIndex="rowIndex" let-value="value"
													 let-row="row"
													 let-group="group">
								<div class="hasTooltip">
									<i *ngIf="!value" class="fa fa-minus"></i>
									<i *ngIf="value"
										 class="fa {{getCheckBox(value.result)}}">{{getCheckBox(value.result) === '' ? value.result : ''}}</i>
									<span *ngIf="value.completedBy"
												class="tooltip-text">{{"'" + (value.note ? value.note : value.result) + "' "}}{{value.completedBy}}</span>
								</div>
							</ng-template>
						</ngx-datatable-column>
						<ngx-datatable-column *ngFor="let x of style.props" [name]="x.name"
																	[prop]="(x.prop) ? x.prop : x.name"
																	[flexGrow]="2">
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
	title: string;
	loading: boolean = true;
	reloading: boolean = true;
	headingDaily = [
		{prop: 'compartment', dragable: false, resizeable: false},
		{prop: 'item', dragable: false, resizeable: false},
		{prop: 'sunday', name: 'Sun', dragable: false, resizeable: false},
		{prop: 'monday', dragable: false, resizeable: false},
		{prop: 'tuesday', dragable: false, resizeable: false},
		{prop: 'wednesday', dragable: false, resizeable: false},
		{prop: 'thursday', dragable: false, resizeable: false},
		{prop: 'friday', dragable: false, resizeable: false},
		{prop: 'saturday', dragable: false, resizeable: false}
	];
	headingWeekly = [
		{prop: 'compartment', dragable: false, resizeable: false},
		{prop: 'item', dragable: false, resizeable: false},
		{prop: 'status', dragable: false, resizeable: false}
	];
	old: any[] = [
		{
			name: "ATV 46 Checklist test", schedule: "Daily", status: "Complete", id: '10012',
			data: {
				heading: this.headingDaily,
				rows: [
					{
						Compartment: "Driver #1",
						Item: "Horn",
						Sun: "Okay",
						Mon: 'Okay',
						Tues: 'Okay',
						Wed: 'Broken',
						Thur: 'Okay',
						Fri: 'Broken',
						Sat: 'Okay'
					},
					{
						Compartment: "Driver #1",
						Item: "Lights",
						Sun: "Broken",
						Mon: 'Okay',
						Tues: 'Okay',
						Wed: 'Broken',
						Thur: 'Broken',
						Fri: 'Okay',
						Sat: 'Okay'
					},
					{
						Compartment: "Driver #1",
						Item: "Bells",
						Sun: "Missing",
						Mon: 'Okay',
						Tues: 'Okay',
						Wed: 'Broken',
						Thur: 'Okay',
						Fri: 'Okay',
						Sat: 'Okay'
					},
					{
						Compartment: "Driver #1",
						Item: "Horn",
						Sun: "Okay",
						Mon: 'Okay',
						Tues: 'Okay',
						Wed: 'Broken',
						Thur: 'Okay',
						Fri: 'Broken',
						Sat: 'Okay'
					},
					{
						Compartment: "Driver #1",
						Item: "Lights",
						Sun: "Broken",
						Mon: 'Okay',
						Tues: 'Okay',
						Wed: 'Broken',
						Thur: 'Broken',
						Fri: 'Okay',
						Sat: 'Okay'
					},
					{
						Compartment: "Driver #1",
						Item: "Bells",
						Sun: "Missing",
						Mon: 'Okay',
						Tues: 'Okay',
						Wed: 'Broken',
						Thur: 'Okay',
						Fri: 'Okay',
						Sat: 'Okay'
					},
					{
						Compartment: "Driver #1",
						Item: "Horn",
						Sun: "Okay",
						Mon: 'Okay',
						Tues: 'Okay',
						Wed: 'Broken',
						Thur: 'Okay',
						Fri: 'Broken',
						Sat: 'Okay'
					},
					{
						Compartment: "Driver #1",
						Item: "Lights",
						Sun: "Broken",
						Mon: 'Okay',
						Tues: 'Okay',
						Wed: 'Broken',
						Thur: 'Broken',
						Fri: 'Okay',
						Sat: 'Okay'
					},
					{
						Compartment: "Driver #1",
						Item: "Bells",
						Sun: "Missing",
						Mon: 'Okay',
						Tues: 'Okay',
						Wed: 'Broken',
						Thur: 'Okay',
						Fri: 'Okay',
						Sat: 'Okay'
					},
					{
						Compartment: "Driver #2",
						Item: "Map",
						Sun: "Okay",
						Mon: 'Broken',
						Tues: 'Okay',
						Wed: 'Broken',
						Thur: 'Okay',
						Fri: 'Okay',
						Sat: 'Okay'
					},
					{
						Compartment: "Driver #2",
						Item: "Radios",
						Sun: "Okay",
						Mon: 'Okay',
						Tues: 'Broken',
						Wed: 'Broken',
						Thur: 'Broken',
						Fri: 'Okay',
						Sat: 'Okay'
					},
					{
						Compartment: "Driver #2",
						Item: "Radios",
						Sun: "Okay",
						Mon: 'Okay',
						Tues: 'Broken',
						Wed: 'Broken',
						Thur: 'Broken',
						Fri: 'Okay',
						Sat: 'Okay'
					},
					{
						Compartment: "Driver #2",
						Item: "Radios",
						Sun: "Okay",
						Mon: 'Okay',
						Tues: 'Broken',
						Wed: 'Broken',
						Thur: 'Broken',
						Fri: 'Okay',
						Sat: 'Okay'
					}
				]
			}
		},
		{
			name: "ATV 46 Checklist", schedule: "Daily", status: "Complete", id: '10012',
			data: {
				heading: this.headingDaily,
				rows: [
					{
						Compartment: "Driver #1",
						Item: "Horn",
						Sun: "Okay",
						Mon: 'Okay',
						Tues: 'Okay',
						Wed: 'Broken',
						Thur: 'Okay',
						Fri: 'Broken',
						Sat: 'Okay'
					},
					{
						Compartment: "Driver #1",
						Item: "Lights",
						Sun: "Broken",
						Mon: 'Okay',
						Tues: 'Okay',
						Wed: 'Broken',
						Thur: 'Broken',
						Fri: 'Okay',
						Sat: 'Okay'
					},
					{
						Compartment: "Driver #1",
						Item: "Bells",
						Sun: "Missing",
						Mon: 'Okay',
						Tues: 'Okay',
						Wed: 'Broken',
						Thur: 'Okay',
						Fri: 'Okay',
						Sat: 'Okay'
					},
					{
						Compartment: "Driver #1",
						Item: "Horn",
						Sun: "Okay",
						Mon: 'Okay',
						Tues: 'Okay',
						Wed: 'Broken',
						Thur: 'Okay',
						Fri: 'Broken',
						Sat: 'Okay'
					},
					{
						Compartment: "Driver #1",
						Item: "Lights",
						Sun: "Broken",
						Mon: 'Okay',
						Tues: 'Okay',
						Wed: 'Broken',
						Thur: 'Broken',
						Fri: 'Okay',
						Sat: 'Okay'
					},
					{
						Compartment: "Driver #1",
						Item: "Bells",
						Sun: "Missing",
						Mon: 'Okay',
						Tues: 'Okay',
						Wed: 'Broken',
						Thur: 'Okay',
						Fri: 'Okay',
						Sat: 'Okay'
					},
					{
						Compartment: "Driver #1",
						Item: "Horn",
						Sun: "Okay",
						Mon: 'Okay',
						Tues: 'Okay',
						Wed: 'Broken',
						Thur: 'Okay',
						Fri: 'Broken',
						Sat: 'Okay'
					},
					{
						Compartment: "Driver #1",
						Item: "Lights",
						Sun: "Broken",
						Mon: 'Okay',
						Tues: 'Okay',
						Wed: 'Broken',
						Thur: 'Broken',
						Fri: 'Okay',
						Sat: 'Okay'
					},
					{
						Compartment: "Driver #1",
						Item: "Bells",
						Sun: "Missing",
						Mon: 'Okay',
						Tues: 'Okay',
						Wed: 'Broken',
						Thur: 'Okay',
						Fri: 'Okay',
						Sat: 'Okay'
					},
					{
						Compartment: "Driver #2",
						Item: "Map",
						Sun: "Okay",
						Mon: 'Broken',
						Tues: 'Okay',
						Wed: 'Broken',
						Thur: 'Okay',
						Fri: 'Okay',
						Sat: 'Okay'
					},
					{
						Compartment: "Driver #2",
						Item: "Radios",
						Sun: "Okay",
						Mon: 'Okay',
						Tues: 'Broken',
						Wed: 'Broken',
						Thur: 'Broken',
						Fri: 'Okay',
						Sat: 'Okay'
					},
					{
						Compartment: "Driver #2",
						Item: "Radios",
						Sun: "Okay",
						Mon: 'Okay',
						Tues: 'Broken',
						Wed: 'Broken',
						Thur: 'Broken',
						Fri: 'Okay',
						Sat: 'Okay'
					},
					{
						Compartment: "Driver #2",
						Item: "Radios",
						Sun: "Okay",
						Mon: 'Okay',
						Tues: 'Broken',
						Wed: 'Broken',
						Thur: 'Broken',
						Fri: 'Okay',
						Sat: 'Okay'
					}
				]
			}
		},
		{
			name: "ATV 46 Checklist", schedule: "Daily", status: "Complete", id: '10012',
			data: {
				heading: this.headingDaily,
				rows: [
					{
						Compartment: "Driver #1",
						Item: "Horn",
						Sun: "Okay",
						Mon: 'Okay',
						Tues: 'Okay',
						Wed: 'Broken',
						Thur: 'Okay',
						Fri: 'Broken',
						Sat: 'Okay'
					},
					{
						Compartment: "Driver #1",
						Item: "Lights",
						Sun: "Broken",
						Mon: 'Okay',
						Tues: 'Okay',
						Wed: 'Broken',
						Thur: 'Broken',
						Fri: 'Okay',
						Sat: 'Okay'
					},
					{
						Compartment: "Driver #1",
						Item: "Bells",
						Sun: "Missing",
						Mon: 'Okay',
						Tues: 'Okay',
						Wed: 'Broken',
						Thur: 'Okay',
						Fri: 'Okay',
						Sat: 'Okay'
					},
					{
						Compartment: "Driver #1",
						Item: "Horn",
						Sun: "Okay",
						Mon: 'Okay',
						Tues: 'Okay',
						Wed: 'Broken',
						Thur: 'Okay',
						Fri: 'Broken',
						Sat: 'Okay'
					},
					{
						Compartment: "Driver #1",
						Item: "Lights",
						Sun: "Broken",
						Mon: 'Okay',
						Tues: 'Okay',
						Wed: 'Broken',
						Thur: 'Broken',
						Fri: 'Okay',
						Sat: 'Okay'
					},
					{
						Compartment: "Driver #1",
						Item: "Bells",
						Sun: "Missing",
						Mon: 'Okay',
						Tues: 'Okay',
						Wed: 'Broken',
						Thur: 'Okay',
						Fri: 'Okay',
						Sat: 'Okay'
					},
					{
						Compartment: "Driver #1",
						Item: "Horn",
						Sun: "Okay",
						Mon: 'Okay',
						Tues: 'Okay',
						Wed: 'Broken',
						Thur: 'Okay',
						Fri: 'Broken',
						Sat: 'Okay'
					},
					{
						Compartment: "Driver #1",
						Item: "Lights",
						Sun: "Broken",
						Mon: 'Okay',
						Tues: 'Okay',
						Wed: 'Broken',
						Thur: 'Broken',
						Fri: 'Okay',
						Sat: 'Okay'
					},
					{
						Compartment: "Driver #1",
						Item: "Bells",
						Sun: "Missing",
						Mon: 'Okay',
						Tues: 'Okay',
						Wed: 'Broken',
						Thur: 'Okay',
						Fri: 'Okay',
						Sat: 'Okay'
					},
					{
						Compartment: "Driver #2",
						Item: "Map",
						Sun: "Okay",
						Mon: 'Broken',
						Tues: 'Okay',
						Wed: 'Broken',
						Thur: 'Okay',
						Fri: 'Okay',
						Sat: 'Okay'
					},
					{
						Compartment: "Driver #2",
						Item: "Radios",
						Sun: "Okay",
						Mon: 'Okay',
						Tues: 'Broken',
						Wed: 'Broken',
						Thur: 'Broken',
						Fri: 'Okay',
						Sat: 'Okay'
					},
					{
						Compartment: "Driver #2",
						Item: "Radios",
						Sun: "Okay",
						Mon: 'Okay',
						Tues: 'Broken',
						Wed: 'Broken',
						Thur: 'Broken',
						Fri: 'Okay',
						Sat: 'Okay'
					},
					{
						Compartment: "Driver #2",
						Item: "Radios",
						Sun: "Okay",
						Mon: 'Okay',
						Tues: 'Broken',
						Wed: 'Broken',
						Thur: 'Broken',
						Fri: 'Okay',
						Sat: 'Okay'
					}
				]
			}
		},
		{
			name: "Engine 44 Checklist", schedule: "Daily", status: "Complete", id: '10014',
			data: {
				heading: this.headingDaily,
				rows: [
					{
						Compartment: "Driver #1",
						Item: "Horn",
						Sun: "Okay",
						Mon: 'Okay',
						Tues: 'Okay',
						Wed: 'Broken',
						Thur: 'Okay',
						Fri: 'Broken',
						Sat: 'Okay'
					},
					{
						Compartment: "Driver #1",
						Item: "Lights",
						Sun: "Broken",
						Mon: 'Okay',
						Tues: 'Okay',
						Wed: 'Broken',
						Thur: 'Broken',
						Fri: 'Okay',
						Sat: 'Okay'
					},
					{
						Compartment: "Driver #1",
						Item: "Bells",
						Sun: "Missing",
						Mon: 'Okay',
						Tues: 'Okay',
						Wed: 'Broken',
						Thur: 'Okay',
						Fri: 'Okay',
						Sat: 'Okay'
					},
					{
						Compartment: "Driver #1",
						Item: "Horn",
						Sun: "Okay",
						Mon: 'Okay',
						Tues: 'Okay',
						Wed: 'Broken',
						Thur: 'Okay',
						Fri: 'Broken',
						Sat: 'Okay'
					},
					{
						Compartment: "Driver #1",
						Item: "Lights",
						Sun: "Broken",
						Mon: 'Okay',
						Tues: 'Okay',
						Wed: 'Broken',
						Thur: 'Broken',
						Fri: 'Okay',
						Sat: 'Okay'
					},
					{
						Compartment: "Driver #1",
						Item: "Bells",
						Sun: "Missing",
						Mon: 'Okay',
						Tues: 'Okay',
						Wed: 'Broken',
						Thur: 'Okay',
						Fri: 'Okay',
						Sat: 'Okay'
					},
					{
						Compartment: "Driver #1",
						Item: "Horn",
						Sun: "Okay",
						Mon: 'Okay',
						Tues: 'Okay',
						Wed: 'Broken',
						Thur: 'Okay',
						Fri: 'Broken',
						Sat: 'Okay'
					},
					{
						Compartment: "Driver #1",
						Item: "Lights",
						Sun: "Broken",
						Mon: 'Okay',
						Tues: 'Okay',
						Wed: 'Broken',
						Thur: 'Broken',
						Fri: 'Okay',
						Sat: 'Okay'
					},
					{
						Compartment: "Driver #1",
						Item: "Bells",
						Sun: "Missing",
						Mon: 'Okay',
						Tues: 'Okay',
						Wed: 'Broken',
						Thur: 'Okay',
						Fri: 'Okay',
						Sat: 'Okay'
					},
					{
						Compartment: "Driver #2",
						Item: "Map",
						Sun: "Okay",
						Mon: 'Broken',
						Tues: 'Okay',
						Wed: 'Broken',
						Thur: 'Okay',
						Fri: 'Okay',
						Sat: 'Okay'
					},
					{
						Compartment: "Driver #2",
						Item: "Radios",
						Sun: "Okay",
						Mon: 'Okay',
						Tues: 'Broken',
						Wed: 'Broken',
						Thur: 'Broken',
						Fri: 'Okay',
						Sat: 'Okay'
					},
					{
						Compartment: "Driver #2",
						Item: "Radios",
						Sun: "Okay",
						Mon: 'Okay',
						Tues: 'Broken',
						Wed: 'Broken',
						Thur: 'Broken',
						Fri: 'Okay',
						Sat: 'Okay'
					},
					{
						Compartment: "Driver #2",
						Item: "Radios",
						Sun: "Okay",
						Mon: 'Okay',
						Tues: 'Broken',
						Wed: 'Broken',
						Thur: 'Broken',
						Fri: 'Okay',
						Sat: 'Okay'
					}
				]
			}
		},
		{
			name: "Engine 46 Checklist", schedule: "Weekly", status: "Not Complete", id: '10015',
			data: {
				heading: this.headingWeekly,
				rows: [
					{Compartment: "Driver #1", Item: "Horn", status: 'Okay'},
					{Compartment: "Driver #1", Item: "Lights", status: '    '},
					{Compartment: "Driver #1", Item: "Bells", status: 'Okay'},
					{Compartment: "Driver #1", Item: "Horn", status: '    '},
					{Compartment: "Driver #1", Item: "Lights", status: 'Okay'},
					{Compartment: "Driver #1", Item: "Bells", status: 'Broken'},
					{Compartment: "Driver #1", Item: "Horn", status: '    '},
					{Compartment: "Driver #1", Item: "Lights", status: 'Okay'},
					{Compartment: "Driver #1", Item: "Bells", status: 'Okay'},
					{Compartment: "Driver #2", Item: "Map", status: 'Okay'},
					{Compartment: "Driver #2", Item: "Radios", status: ''},
					{Compartment: "Driver #2", Item: "Radios", status: 'Okay'},
					{Compartment: "Driver #2", Item: "Radios", status: 'Okay'}
				]
			}
		}
	];
	filter;
	webService: WebService;
	viewType: string = 'view';
	temp: any;
	selected;
	original;
	date;
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
	heading: any[] = [
		{prop: 'name', dragable: false, resizeable: false},
		{prop: 'schedule', dragable: false, resizeable: false},
		{prop: 'status', dragable: false, resizeable: false},
		{prop: 'id', dragable: false, resizeable: false}];
	reports: any[];

	constructor(webService: WebService) {
		this.webService = webService;

		webService.setState('reports');
		this.doGet();
	}

	toggle() {
		this.viewType = 'view';
		this.style = (this.previousStyle) ? this.previousStyle : this.style;
		this.table.rows = this.reports;
		this.title = '';
		delete this.previousStyle;
		delete this.temp;
		this.updateFilter(undefined);
	}

	updateFilter(event) {
		let val = (!event) ? '' : event.target.value.toLowerCase();
		const source = this.temp ? this.temp :
			{rows: this.original, heading: this.heading};

		if (!event) this.filter = "";

		this.reports = (!event) ?
			this.original : source.rows.filter(row => {
				for (let i = 0, len = (!val ? 1 : source.heading.length); i < len; i++)
					if (val == '' || ("" + row[source.heading[i].prop]).toLowerCase().indexOf(val) !== -1)
						return true;
				return false;
			});
	}

	onclick(event, m) {
		if (this.viewType == 'edit')
			return;
		this.viewType = 'edit';
		this.filter = "";
		this.previousStyle = this.style;
		this.title = event.selected[0].name;
		this.reports = m.rows = (this.temp = {
			rows: event.selected[0].data.rows,
			heading: event.selected[0].data.heading,
			days: event.selected[0].days
		}).rows;
		this.style = this.styles.modal;
		this.style.days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].filter(day => {
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
			Missing: 'fa-lg fa-question box-missing',
			Fail: 'fa-lg fa-close box-broken',
			"Repairs Needed": 'fa-lg fa-close box-broken',
			other: 'fa-minus'
		};
		return (options[status]) ? options[status] : (status.length) ? '' : options.other;
	};

	doGet(date = undefined) {
		this.webService
			.doGet('/reports', (date) ? '&date=' + date : '')
			.subscribe((resp) => {
				this.original = this.reports = resp['reports'].map((r) => {
					if (r.status === 'Daily')
						r.data.heading = this.headingDaily;
					else
						r.data.heading = this.headingWeekly;

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

	getReports(datepicker = this.date) {
		if (datepicker === this.date)
			return;
		this.date = datepicker;
		let self = this;
		let dateParts = datepicker.split('/');
		let date = dateParts[2] + this.pad(dateParts[0]) + this.pad(dateParts [1]);
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
