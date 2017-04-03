//import './rxjs-extensions';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { DropdownModule } from 'ng2-bootstrap/dropdown';

// App components
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// Main areas
import { EmptyStateExampleModule } from './emptystate/examples/emptystate-example.module';
import { FilterExampleModule } from './filters/examples/filter-example.module';
import { HomeModule } from './home/home.module';
import { ListViewExampleModule } from './listview/examples/listview-example.module';
import { SortExampleModule } from './sort/examples/sort-example.module';
import { NotificationExampleModule } from './notification/examples/notification-example.module';
import { ToolbarExampleModule } from './toolbar/examples/toolbar-example.module';
import { TreeListExampleModule } from './treelist/examples/treelist-example.module';
import { SlideOutExampleModule } from './slide-out-panel/examples/slide-out-example.module';

@NgModule({
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    DropdownModule,
    EmptyStateExampleModule,
    FilterExampleModule,
    FormsModule,
    HomeModule,
    HttpModule,
    ListViewExampleModule,
    NotificationExampleModule,
    SortExampleModule,
    SlideOutExampleModule,
    ToolbarExampleModule,
    TreeListExampleModule
  ],
  declarations: [
    AppComponent
  ],
  providers: [],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
