import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';
import { HttpModule, Http } from '@angular/http';

import { PipelinesComponent }     from './pipelines.component';
import { PipelinesRoutingModule } from './pipelines-routing.module';
import { SpaceModule } from 'fabric8-runtime-console';
import { RestangularModule } from 'ng2-restangular';
import { KubernetesRestangularModule } from 'fabric8-runtime-console/src/app/kubernetes/service/kubernetes.restangular';

@NgModule({
  imports:      [ CommonModule,
    PipelinesRoutingModule,
    RestangularModule,
    KubernetesRestangularModule,
    HttpModule,
    SpaceModule ],
  declarations: [ PipelinesComponent ],
})
export class PipelinesModule {
  constructor(http: Http) {}
}
