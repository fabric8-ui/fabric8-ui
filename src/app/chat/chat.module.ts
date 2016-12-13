import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';
import { HttpModule, Http } from '@angular/http';

import { ChatComponent }     from './chat.component';
import { ChatRoutingModule } from './chat-routing.module';

@NgModule({
  imports:      [ CommonModule, ChatRoutingModule, HttpModule ],
  declarations: [ ChatComponent ],
})
export class ChatModule {
  constructor(http: Http) {}
}