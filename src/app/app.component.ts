import { Component } from '@angular/core';

/*
 * App Component
 * Top Level Component
 */
@Component({
  host: { 'class': 'app app-component flex-container in-column-direction flex-grow-1' },
  selector: 'demo-app',
  styles: [ require('./app.component.scss') ],
  template: require('./app.component.html')
})
export class AppComponent {

  constructor() {}

  ngOnInit() {}
}
