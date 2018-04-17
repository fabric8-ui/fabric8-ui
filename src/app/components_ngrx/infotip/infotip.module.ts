import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfotipComponent } from './infotip.component';
import { PopoverModule } from 'ngx-bootstrap';

@NgModule({
  imports: [CommonModule, PopoverModule.forRoot()],
  declarations: [InfotipComponent],
  exports: [InfotipComponent]
})

export class InfotipModule {} 