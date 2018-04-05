import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { WidgetsModule } from 'ngx-widgets';

import { SelectDropdownModule } from './../../widgets/select-dropdown/select-dropdown.module';
import { CommonSelectorComponent } from './common-selector.component';

@NgModule({
  imports: [
    CommonModule,
    SelectDropdownModule,
    WidgetsModule
  ],
  declarations: [
    CommonSelectorComponent
  ],
  exports: [
    CommonSelectorComponent
  ]
})

export class CommonSelectorModule {

}
