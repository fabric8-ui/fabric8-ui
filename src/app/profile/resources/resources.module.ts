import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';
import { HttpModule, Http } from '@angular/http';

import { ResourcesComponent }     from './resources.component';
import { ResourcesRoutingModule } from './resources-routing.module';

@NgModule({
  imports:      [ CommonModule, ResourcesRoutingModule, HttpModule ],
  declarations: [ ResourcesComponent ],
  exports: [ ResourcesComponent ]
})
export class ResourcesModule {}