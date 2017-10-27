import {Component, Input, ViewChild} from "@angular/core";
import {saveAs} from 'file-saver';

@Component({
	selector: 'qr-clickable',
	template: `
		<span (click)="this.saveAs(title)" style="cursor: pointer">
			<span class="hasTooltip">
				<i class="fa fa-lg fa-qrcode"></i>
				<span class="tooltip-text">
					<qr-code #qr [value]="value" [size]="150" [canvas]="true"></qr-code>
				</span>
			</span> Download
		</span>
	`
})
export class QR {
	@Input('title') title: string;
	@Input('value') value: string;
	@ViewChild('qr') qr;

	constructor() {
	}

	ngOnInit() {
	}

	saveAs(title = 'qrcode') {
		let canvas = this.qr.elementRef.nativeElement.firstChild;
		canvas.toBlob(function (blob) {
			saveAs(blob, title + '.png');
		});
	}
}