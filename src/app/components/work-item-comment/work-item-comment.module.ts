
import { GlobalSettings } from '../../shared/globals';
import { HttpModule, Http }    from '@angular/http';
import { HttpService } from './../../services/http-service';
import { RouterModule } from '@angular/router';
import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { FormsModule }        from '@angular/forms';

import { WorkItemCommentComponent } from './work-item-comment.component';

import { MockHttp } from '../../mock/mock-http';


let providers = [];

if (process.env.ENV == 'inmemory') {
  providers = [
    GlobalSettings,
    {
      provide: HttpService,
      useExisting: MockHttp
     }
   ];
} else {
  providers = [
     GlobalSettings
    ];
}

@NgModule({
  imports:      [
    CommonModule,
    FormsModule,
    RouterModule,
    HttpModule
  ],
  declarations: [
   ],
  exports:      [ WorkItemCommentComponent ],
  providers: providers
})
export class WorkItemCommentModule { }
