import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule, Http } from '@angular/http';

import { ToolbarModule, ToolbarConfig } from 'ngx-widgets';
import {
  ComponentLoaderFactory,
  DropdownConfig,
  DropdownModule,
  PositioningService,
  TooltipConfig
} from 'ng2-bootstrap';

import { EnvironmentsComponent } from './environments.component';
import { EnvironmentsRoutingModule } from './environments-routing.module';
import { PipelineModule } from 'fabric8-runtime-console';
import { SwitchableNamespaceScope } from './switchable-namepsace.scope';

// TODO HACK These should all be exported by the modules
import { RestangularModule } from 'ng2-restangular';
import { KubernetesRestangularModule } from 'fabric8-runtime-console/src/app/kubernetes/service/kubernetes.restangular';
import { LoginService } from 'fabric8-runtime-console/src/app/shared/login.service';
import { OnLogin } from 'fabric8-runtime-console/src/app/shared/onlogin.service';
import { OAuthConfigStore } from 'fabric8-runtime-console/src/app/kubernetes/store/oauth-config-store';
import { BuildConfigService } from 'fabric8-runtime-console/src/app/kubernetes/service/buildconfig.service';
import { DevNamespaceScope } from 'fabric8-runtime-console/src/app/kubernetes/service/devnamespace.scope';
import { BuildService } from 'fabric8-runtime-console/src/app/kubernetes/service/build.service';
import { APIsStore } from 'fabric8-runtime-console/src/app/kubernetes/store/apis.store';
import { BuildConfigStore } from 'fabric8-runtime-console/src/app/kubernetes/store/buildconfig.store';
import { BuildStore } from 'fabric8-runtime-console/src/app/kubernetes/store/build.store';

@NgModule({
  imports: [CommonModule,
    EnvironmentsRoutingModule,
    RestangularModule,
    KubernetesRestangularModule,
    HttpModule,
    PipelineModule,
    ToolbarModule,
    DropdownModule],
  declarations: [EnvironmentsComponent],
  providers: [
    ComponentLoaderFactory,
    DropdownConfig,
    PositioningService,
    TooltipConfig,

    // TODO HACK These are providers that need reorging in fabric8-runtime
    LoginService,
    OnLogin,
    OAuthConfigStore,
    BuildConfigService,
    APIsStore,
    BuildConfigStore,
    BuildStore,
    BuildService,
    // Hack in our own namespace scope manager
    {
      provide: DevNamespaceScope,
      useClass: SwitchableNamespaceScope
    }
  ]
})
export class EnvironmentsModule {
  constructor(http: Http) { }
}
