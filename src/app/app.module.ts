// import './rxjs-extensions';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
// App components
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// Main areas
import {
  GitHubLinkAreaExampleModule
} from './github-link-area/examples/github-link-area-example.module';
import { HomeModule } from './home/home.module';
import { MarkdownExampleModule } from './markdown/examples/markdown-example.module';
import { SlideOutExampleModule } from './slide-out-panel/examples/slide-out-example.module';

@NgModule({
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    GitHubLinkAreaExampleModule,
    HomeModule,
    MarkdownExampleModule,
    SlideOutExampleModule,
  ],
  declarations: [
    AppComponent
  ],
  providers: [],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
