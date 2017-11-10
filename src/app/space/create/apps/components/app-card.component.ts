import {
  Component,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';

import {
  AppsService,
  Environment
} from '../services/apps.service';

import { Observable } from 'rxjs';

@Component({
  selector: 'app-card',
  templateUrl: 'app-card.component.html'
})
export class AppCardComponent implements OnDestroy, OnInit {

  @Input() applicationId: string;
  @Input() environment: Environment;

  collapsed: boolean = true;
  podCount: Observable<number>;
  version: Observable<string>;

  constructor(
    private appsService: AppsService
  ) { }

  ngOnDestroy(): void { }

  ngOnInit(): void {
    this.podCount =
      this.appsService.getPodCount(this.applicationId, this.environment.environmentId);

    this.version =
      this.appsService.getVersion(this.applicationId, this.environment.environmentId);
  }

}
