import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { UniqueSpaceNameValidatorDirective, ValidSpaceNameValidatorDirective } from 'ngx-fabric8-wit';

import { SpaceWizardComponent } from './space-wizard.component';

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [SpaceWizardComponent, UniqueSpaceNameValidatorDirective, ValidSpaceNameValidatorDirective],
  exports: [SpaceWizardComponent, UniqueSpaceNameValidatorDirective]
})
export class SpaceWizardModule {

}
