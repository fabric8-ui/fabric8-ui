import { Component } from '@angular/core';
import { AboutService } from '../shared/about.service';

@Component({
  selector: 'alm-app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.less'],
})

export class FooterComponent {

  constructor(public about: AboutService) {

  }

}
