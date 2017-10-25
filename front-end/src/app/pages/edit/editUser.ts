import {Component} from "@angular/core"
import {WebService} from "../../services/webService";

@Component({
	template: `
		<div class="header">
			<h1>Edit Users</h1>
		</div>
		<div class="content" [ngSwitch]="loading">
			<div *ngSwitchCase="true" class="centered">
				<i class="fa fa-5x fa-spinner fa-pulse"></i>
			</div>
			<div *ngSwitchCase="false" [ngSwitch]="users">
				<div [ngSwitch]="viewType">
					<div *ngSwitchCase="'view'">
						<div class="table-options">
							<div class="left">
								<button class="add" (click)="onclick(undefined, table)">
									<i class="fa fa-plus"></i> Add user
								</button>
							</div>
							<div class="right">
								<input
									#tableFilter
									class='filter'
									type='text'
									placeholder='Type to filter...'
									(keyup)='updateFilter($event)'/>
							</div>
						</div>

						<ngx-datatable
							#myTable
							class="table"
							[rows]="users"
							[rowHeight]="'auto'"
							[columns]="heading"
							[columnMode]="'flex'"
							(select)="onclick($event, table)"
							*ngSwitchCase="'view'"
							[selectionType]="'single'">
						</ngx-datatable>
					</div>
					<div *ngSwitchCase="'edit'">
						<div class="table-options">
							<button class="close" (click)="toggle()">
								<i class="fa fa-chevron-left"></i> Back
							</button>
						</div>
						<div class="tile pure-form pure-form-stacked editing" style="height: calc(100vh - 250px)">
							<fieldset>
								<div class="pure-g" style="letter-spacing: 0">
									<div class="pure-u-11-24 pure-u-sm-1">
										<label for="first-name">First Name</label>
										<input #firstName id="first-name" type="text" [ngModel]="temp.firstName"
													 (keyup)="keyup('firstName', firstName.value)">
									</div>
									<div class="pure-u-11-24 pure-u-sm-1">
										<label for="last-name">Last Name</label>
										<input #lastName id="last-name" type="text" [ngModel]="temp.lastName"
													 (keyup)="keyup('lastName', lastName.value)">
									</div>
									<div class="pure-u-11-24 pure-u-sm-1">
										<label for="email">Email</label>
										<input #email id="email" type="text" [ngModel]="temp.email"
													 (keyup)="keyup('email', email.value)">
									</div>

									<div class="pure-u-11-24 pure-u-sm-1"
											 style="display: flex; justify-content: space-between">
										<div>
											<label for="type">Type</label>
											<select #type id="type" [ngModel]="temp.type"
															(change)="temp.type = type.value">
												<option>user</option>
												<option>administrator</option>
											</select>
										</div>
										<div class="pure-form">
											<label>Alert?</label>
											<i class="fa fa-lg {{temp.alert ? 'fa-check-square-o' : 'fa-square-o'}}"
												 (click)="temp.alert = !temp.alert"></i>
										</div>
									</div>
								</div>
								<br/>
								<button type="submit" class="accept"
												[disabled]="loading || !(temp.firstName && temp.lastName && temp.type && temp.email)"
												(click)="submit()">
									<i class="fa fa-spinner fa-spin" *ngIf="loading && !temp.original"></i>
									Submit
								</button>
								<button type="submit" class="accept" (click)="doDelete()" *ngIf="temp.original"
												[disabled]="loading">
									<i class="fa fa-spinner fa-spin" *ngIf="loading"></i>
									Delete
								</button>
							</fieldset>
						</div>
					</div>
				</div>
			</div>
		</div>
	`
})
export class EditUser {
	loading: any = true;
	heading: any[] = [
		{prop: 'firstName', flexGrow: 3, dragable: false, resizeable: false, style: 'text'},
		{prop: 'lastName', flexGrow: 3, dragable: false, resizeable: false, style: 'text'},
		{prop: 'email', flexGrow: 3, dragable: false, resizeable: false, style: 'text'},
		{prop: 'type', flexGrow: 2, dragable: false, resizable: false, style: 'dropdown'},
		{prop: 'alert', flexGrow: 1, dragable: false, resizable: false, style: 'check'}
		// {prop: 'ID', flexGrow: 1, dragable: false, resizeable: false}
	];
	users: any[];
	viewType = 'view';
	temp;
	filter;
	original;
	webService;

	constructor(webService: WebService) {
		this.webService = webService;
		webService.setState('eUser')
			.doGet('/users')
			.subscribe(resp => {
				this.original = this.users = resp['list'];
			}, () => {
				this.users = undefined;
			}, () => {
				this.loading = false;
			});
	}

	keyup(index, value) {
		this.temp[index] = value;
	}

	submit() {
		if (!(this.temp.firstName && this.temp.lastName && this.temp.type && this.temp.email))
			return;
		if (this.temp.original)
			delete this.temp.original;
		else
			this.users.push(this.temp);

		this.loading = true;
		this.webService.doPost('/users', {user: this.temp})
			.subscribe(() => {
				this.users.push(this.temp);
				this.toggle();
			}, () => {
				this.users.splice(this.temp, 1);
			}, () => {
				this.loading = false;
			});
	}

	doDelete() {
		this.loading = true;
		this.webService.doDelete('/users', {user: {email: this.temp.email}})
			.subscribe(() => {
				this.users.splice(this.users.indexOf(this.temp.original), 1);
				this.toggle();
			}, () => {
			}, () => {
				this.loading = false;
			});
	}

	toggle() {
		delete this.temp;
		this.viewType = 'view';
		this.users = this.original;
		this.updateFilter(undefined);
	}

	onclick(event) {
		this.viewType = 'edit';
		this.temp = (event) ? event.selected[0] : {firstName: "", lastName: "", email: "", alert: false, type: "user"};
		this.temp.original = event ? event.selected[0] : event;
	}

	updateFilter(event) {
		const val = (!event) ? '' : event.target.value.toLowerCase();
		const source = this.temp ? this.temp :
			{rows: this.original, heading: this.heading};

		if (!event)
			this.filter = "";
		this.users = (!event) ?
			this.original : source.rows.filter(row => {
				for (let i = 0, len = (!val ? 1 : source.heading.length); i < len; i++)
					if (val == '' || ("" + row[source.heading[i].prop]).toLowerCase().indexOf(val) !== -1)
						return true;
				return false;
			});
	}
}
