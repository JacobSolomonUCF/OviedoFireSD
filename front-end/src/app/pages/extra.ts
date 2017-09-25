import {Component} from "@angular/core";
import {WebService} from "../services/webService";

@Component({
  template: `
    <div class="header">
      <h1>Extras</h1>
    </div>

    <div class="content"></div>
  `
  , styleUrls: ['../menu.sass']
})
export class Extra {

  constructor(webService: WebService) {
    webService.setState('extras');
  }

}
