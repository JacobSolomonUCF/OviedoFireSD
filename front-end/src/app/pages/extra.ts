import {Component} from "@angular/core";
import {WebService} from "../services/webService";

@Component({
  template: `
    <div class="header">
      <h1>Extras</h1>
    </div>

    <div class="content">
      <div>
        <datepicker></datepicker>
      </div>
    </div>
  `
  , styleUrls: ['../menu.sass']
})
export class Extra {

  myFilter = (d: Date): boolean => {
    const day = d.getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  };

  constructor(webService: WebService) {
    webService.setState('extras');
  }

}
