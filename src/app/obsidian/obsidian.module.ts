import { NgModule } from '@angular/core';

import { WizardModule } from 'obsidian-generator-frontend/src/app/wizard/wizard.module';
import { ObsidianRoutingModule } from './obsidian-routing.module';

@NgModule({
  imports: [ WizardModule, ObsidianRoutingModule ]
})
export class ObsidianModule { }