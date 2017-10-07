import {Component, ViewEncapsulation} from '@angular/core';

import {AngularFireAuth} from 'angularfire2/auth';
import {Observable} from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import {WebService} from "./services/webService";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./menu.sass'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  user: Observable<firebase.User>;

  constructor(public afAuth: AngularFireAuth, public webService: WebService) {
    this.user = this.afAuth.authState;
  }

  checkState() {
    return this.webService.checkState();
  }

  login(email, password) {
    this.webService.login(email, password);
  }

  logout() {
    this.webService.logout();
  }
}
