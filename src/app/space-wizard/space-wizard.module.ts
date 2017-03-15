import { UniqueSpaceNameValidatorDirective } from './unique-space-name.directive';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpaceWizardComponent } from './space-wizard.component';

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [SpaceWizardComponent, UniqueSpaceNameValidatorDirective],
  exports: [SpaceWizardComponent, UniqueSpaceNameValidatorDirective]
})
export class SpaceWizardModule {

}
