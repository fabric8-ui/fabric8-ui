import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  encapsulation: ViewEncapsulation.None,
  host: {'class': 'app app-component flex-container in-column-direction flex-grow-1'},
  selector: 'demo-home',
  template: require('./home.component.html'),
  styles: [ require('./home.component.css').toString() ]
})
export class HomeComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() {}
}
