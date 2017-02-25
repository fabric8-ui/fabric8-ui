import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'demo-home',
  template: require('./home.component.html'),
  styles: [ require('./home.component.css') ]
})
export class HomeComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() {}
}
