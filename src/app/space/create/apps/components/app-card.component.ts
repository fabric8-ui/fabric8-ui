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

import { Subject } from 'rxjs';

@Component({
  selector: 'app-card',
  templateUrl: 'app-card.component.html'
})
export class AppCardComponent implements OnDestroy, OnInit {

  @Input() applicationId: string;
  @Input() environment: Environment;

  collapsed: boolean = true;
  podCount: number = 0;
  version: string = '1.0.2';

  public memoryConfig: any;
  public memoryData: any = {
    dataAvailable: true,
    total: 100,
    xData: ['time', 10, 11, 12],
    yData: ['memory', 10, 20, 30]
  };

  private readonly unsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private appsService: AppsService
  ) { }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  ngOnInit(): void {
    this.memoryConfig = {
      chartId: 'memory-' + this.applicationId + '-' + this.environment.name,
      tooltipType: 'default'
    };
    this.appsService
      .getPodCount(this.applicationId, this.environment.environmentId)
      .takeUntil(this.unsubscribe)
      .subscribe(val => this.podCount = val);
  }

}
