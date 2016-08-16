import { Component } from '@angular/core';

import '../../public/css/styles.css';
import './rxjs-extensions';

@Component({
  selector: 'my-app',
  templateUrl: '/app.component.html',
  styleUrls: ['/app.component.css']
  })
export class AppComponent {
  title = 'Red Hat ALMighty';
}
