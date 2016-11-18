import { Component } from '@angular/core';

@Component({
  selector: 'detail',
  styleUrls: [ './detail.component.scss' ],
  templateUrl: './detail.component.html'
})
export class DetailComponent {
  constructor() {

  }

  ngOnInit() {
    console.log('hello `Detail` component');
  }

}
