import { CodebasesService } from './../services/codebases.service';
import { CodebasesCreateRoutingModule } from './codebases-create-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { SlideOutPanelModule } from 'ngx-widgets';

import { CodebasesCreateComponent } from './codebases-create.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    SlideOutPanelModule,
    CodebasesCreateRoutingModule
  ],
  declarations: [CodebasesCreateComponent],
  exports: [CodebasesCreateComponent],
  providers: [CodebasesService]
})
export class CodebasesCreateModule {
  constructor(http: Http) { }
}
