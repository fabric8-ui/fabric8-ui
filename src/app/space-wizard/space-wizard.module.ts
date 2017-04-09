import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UniqueSpaceNameValidatorDirective, ValidSpaceNameValidatorDirective } from 'ngx-fabric8-wit';
import { AuthenticationService } from 'ngx-login-client';

import { runtimeConsoleImports } from './../shared/runtime-console/runtime-console';
import { LoggerFactory } from './common/logger';
import { ForgeAppGeneratorComponent } from './components/forge-app-generator/forge-app-generator.component';
import { WorkflowFactory } from './models/workflow';

import { IForgeServiceProvider } from './services/forge.service';
import { SpaceWizardComponent } from './space-wizard.component';
import { SelectedItemsPipe } from './pipes/selected-items.pipe';
import { VisibleItemsPipe } from './pipes/visible-items.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    SpaceWizardComponent,
    ForgeAppGeneratorComponent,
    UniqueSpaceNameValidatorDirective,
    ValidSpaceNameValidatorDirective,
    SelectedItemsPipe,
    VisibleItemsPipe
  ],
  exports: [
    SpaceWizardComponent,
    UniqueSpaceNameValidatorDirective
  ],
  providers: [
    IForgeServiceProvider.FactoryProvider,
    LoggerFactory,
    WorkflowFactory,
    AuthenticationService
  ]
})

export class SpaceWizardModule {

}

