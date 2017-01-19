import { NgModule }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ChatComponent } from './chat.component';

const routes: Routes = [
  {
    path: 'chat',
    component: ChatComponent
    /* Having children here breaks the import into runtime. Don't know why. Though, an empty child def like this does not makes sense
    ,children: [
      {
        path: ''
      }
    ]
    */
  },

];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class ChatRoutingModule {}