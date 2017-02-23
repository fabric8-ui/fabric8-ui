import { Component } from '@angular/core';

@Component({
  selector: 'alm-app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})

export class FooterComponent {

  get buildNumber(): string {
    return process.env.BUILD_NUMBER;
  }

}
