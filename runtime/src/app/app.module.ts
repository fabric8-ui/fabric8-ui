import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgModule, ApplicationRef } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

// App is our top level component
import { AppComponent } from './app.component';
import { HomeComponent } from './home';

import { MockDataService } from 'fabric8-planner';

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [ // import Angular's modules
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot([
      { path: '',      component: HomeComponent },
      { path: 'home',  component: HomeComponent }
    ], { useHash: true, preloadingStrategy: PreloadAllModules })
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
    MockDataService
  ]
})
export class AppModule {

  constructor(
    public appRef: ApplicationRef,
    public mockDataService: MockDataService
  ) {
    console.log(mockDataService);
  }

}
