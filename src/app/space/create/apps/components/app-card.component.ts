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
  version: string = '1.0.2';

  memoryConfig: any;
  memoryData: any = {
    dataAvailable: true,
    total: 100,
    xData: ['time', 10, 11, 12],
    yData: ['memory', 10, 20, 30]
  };

  constructor(
    private appsService: AppsService
  ) { }

  ngOnDestroy(): void { }

  ngOnInit(): void {
    this.memoryConfig = {
      chartId: 'memory-' + this.applicationId + '-' + this.environment.name,
      tooltipType: 'default'
    };

    this.podCount =
      this.appsService.getPodCount(this.applicationId, this.environment.environmentId);
  }

}
