import {Component} from "@angular/core";
import {WebService} from "../services/webService";

@Component({
	template: `
		<div class="header">
			<h1>Extras</h1>
		</div>

		<div class="content">
			<div class="row flex">
				<div class="tile white flex-grow">
					<div class="tile-head">
						<h3>Mobile Applications</h3>
					</div>
					<div class="tile white centered" *ngIf="loading">
						<br/>
						<i class="fa fa-5x fa-spinner fa-pulse"></i>
					</div>
					<ul class="to-do white">
						<li>
							<i class="fa fa-android"></i> <a href="">Android .apk</a>
						</li>
						<li>
							<i class="fa fa-apple"></i> <a href="">iOS .pdk</a>
						</li>
					</ul>
				</div>
			</div>
		</div>
	`
	, styleUrls: ['../menu.sass']
})
export class Extra {

	constructor(webService: WebService) {
		webService.setState('extras');
	}
}
