import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap';
import { ClickOutModule } from '../../widgets/clickout/clickout.module';
import { FilterColumnModule } from './../../pipes/column-filter.module';
import { TableConfigComponent } from './table-config.component';


@NgModule({
  imports: [
    CommonModule,
    ClickOutModule,
    ClickOutModule,
    FilterColumnModule,
    BsDropdownModule
  ],
  declarations: [TableConfigComponent],
  exports: [TableConfigComponent],
  providers: [BsDropdownConfig]
})

export class TableConfigModule {}
