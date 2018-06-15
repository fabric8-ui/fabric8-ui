import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { WidgetsModule } from 'ngx-widgets';
import { SelectDropdownModule } from './../../widgets/select-dropdown/select-dropdown.module';
import { AssigneeSelectorComponent } from './assignee-selector.component';

@NgModule({
  imports: [
    CommonModule,
    SelectDropdownModule,
    WidgetsModule
  ],
  declarations: [
    AssigneeSelectorComponent
  ],
  exports: [
    AssigneeSelectorComponent
  ]
})

export class AssigneeSelectorModule {

}
