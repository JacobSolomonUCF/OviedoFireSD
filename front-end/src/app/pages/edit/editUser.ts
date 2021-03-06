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
								<button class="add" (click)="this.onclick(undefined, table)">
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
							[columnMode]="'flex'"
							(select)="this.onclick($event, table)"
							*ngSwitchCase="'view'"
							[selectionType]="'single'">
							<ngx-datatable-column *ngFor="let h of heading" [name]="h.name" [prop]="h.prop" [flexGrow]="h.flexGrow">
								<ng-template ngx-datatable-cell-template let-rowIndex="rowIndex" let-value="value" let-row="row"
														 let-group="group">
									<span [ngSwitch]="row[h.prop]">
										<span *ngSwitchCase="true"><i class="fa fa-lg fa-check"></i></span>
										<span *ngSwitchCase="false"><i class="fa fa-lg fa-times"></i></span>
										<span *ngSwitchDefault>{{value}}</span>
									</span>
								</ng-template>
							</ngx-datatable-column>
						</ngx-datatable>
					</div>
					<div *ngSwitchCase="'edit'">
						<div class="table-options">
							<button class="close" (click)="toggle()">
								<i class="fa fa-chevron-left"></i> Back
							</button>
						</div>
						<div class="tile white pure-form pure-form-stacked editing" style="height: calc(100vh - 250px)">
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
										<div class="pure-form" *ngIf="temp.type === 'administrator'">
											<label>Alert?</label>
											<label class="checkbox">
												<input type="checkbox" [(ngModel)]="temp.alert"/>
												<i class="fa fa-fw fa-2x fa-square-o unchecked"></i>
												<i class="fa fa-fw fa-2x fa-check-square box-okay checked"></i>
											</label>
										</div>
									</div>
								</div>
								<br/>
								<button type="submit" class="accept"
												[disabled]="loading || !(temp.firstName && temp.lastName && temp.type && temp.email)"
												(click)="submit()">
									<i class="fa fa-spinner fa-pulse" *ngIf="loading"></i>
									Submit
								</button>
								<button type="submit" class="accept" (click)="doDelete()" *ngIf="original"
												[disabled]="loading">
									<i class="fa fa-spinner fa-pulse" *ngIf="loading"></i>
									Delete
								</button>
								<button type="submit" class="accept" (click)="resetPassword()" *ngIf="original"
												[disabled]="loading">
									<i class="fa fa-spinner fa-pulse" *ngIf="loading"></i>
									Reset Password
								</button>
								<span style="color: red">{{error}}</span>
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
		{prop: 'firstName', name: 'First Name', flexGrow: 3, dragable: false, resizeable: false},
		{prop: 'lastName', name: 'Last Name', flexGrow: 3, dragable: false, resizeable: false},
		{prop: 'email', name: 'Email', flexGrow: 3, dragable: false, resizeable: false},
		{prop: 'type', name: 'Type', flexGrow: 2, dragable: false, resizable: false},
		{prop: 'alert', name: 'Alert', flexGrow: 1, dragable: false, resizable: false}
	];
	users: any[];
	viewType = 'view';
	error: string;
	temp;
	filter;
	original;
	usersList;
	webService: WebService;

	constructor(webService: WebService) {
		this.webService = webService;

		webService.setState('eUser')
			.doGet('/users')
			.subscribe(resp => {
				this.usersList = this.users = resp['list'];
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
		if (this.temp.type === 'user')
			this.temp.alert = false;

		this.loading = true;
		delete this.error;
		this.webService.doPost('/users', {user: this.temp})
			.subscribe(() => {
				if (!this.original)
					this.users.push(this.temp);
				else
					this.original = this.temp;
				this.toggle();
			}, error => {
				this.loading = false;
				this.error = JSON.parse(error.error).message;
			}, () => {
				this.loading = false;
			});
	}

	doDelete() {
		this.loading = true;
		this.webService.doDelete('/users', {user: this.temp})
			.subscribe(() => {
				this.users.splice(this.users.indexOf(this.original), 1);
				this.toggle();
			}, () => {
			}, () => {
				this.loading = false;
			});
	}

	resetPassword() {
		this.loading = true;
		this.webService.doPost('/resetPassword', {user: {email: this.temp.email}}).subscribe(() => {
			this.toggle();
		}, () => {
		}, () => {
			this.loading = false;
		});
	}

	toggle() {
		delete this.temp;
		delete this.error;
		delete this.original;
		this.viewType = 'view';
		this.users = this.usersList;
		this.updateFilter(undefined);
	}

	onclick(event) {
		this.viewType = 'edit';
		this.original = (event) ? event.selected[0] : undefined;
		this.temp = this.original ? {...this.original} : {
			firstName: "",
			lastName: "",
			email: "",
			alert: false,
			type: "user"
		};
	}

	updateFilter(event) {
		const val = (!event) ? '' : event.target.value.toLowerCase();
		const source = this.temp ? this.temp :
			{rows: this.usersList, heading: this.heading};

		if (!event)
			this.filter = "";
		this.users = (!event) ?
			this.usersList : source.rows.filter(row => {
				for (let i = 0, len = (!val ? 1 : source.heading.length); i < len; i++)
					if (val == '' || ("" + row[source.heading[i].prop]).toLowerCase().indexOf(val) !== -1)
						return true;
				return false;
			});
	}
}
