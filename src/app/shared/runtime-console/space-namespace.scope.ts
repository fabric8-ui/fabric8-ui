import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { UserService } from 'ngx-login-client';

import { DevNamespaceScope } from 'fabric8-runtime-console';
import { SpaceNamespaceService } from './space-namespace.service';

import { StaticNamespaceScope } from './static-namespace.scope';
import { ObservableFabric8UIConfig } from './../../shared/config/fabric8-ui-config.service';

/**
 * A NamespaceScope which returns the space-namespace for the space
 */
@Injectable()
export class SpaceNamespaceScope extends StaticNamespaceScope {

  constructor(
    activatedRoute: ActivatedRoute,
    router: Router,
    spaceNamespaceService: SpaceNamespaceService
  ) {
    super(
      activatedRoute,
      router,
      spaceNamespaceService.buildNamespace()
    );
  }
}

export let spaceDevNamespaceScopeProvider = {
  provide: DevNamespaceScope,
  useClass: SpaceNamespaceScope
};
