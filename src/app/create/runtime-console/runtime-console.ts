// Shared stuff for importing the runtime console

import { RestangularModule } from 'ng2-restangular';
import {
  // Base functionality for the runtime console
  KubernetesStoreModule,
  KubernetesRestangularModule,
  PipelineModule
} from 'fabric8-runtime-console';

export let runtimeConsoleImports = [
  KubernetesStoreModule,
  RestangularModule,
  KubernetesRestangularModule
];


