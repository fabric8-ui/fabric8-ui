import './rxjs-extensions';

import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Http, HttpModule } from "@angular/http";

// import { DropdownModule } from 'ngx-dropdown';

import { ContainerTogglerModule } from './src/app/container-toggler/container-toggler.module';
import { DialogModule } from './src/app/dialog/dialog.module';
import { DropdownModule } from './src/app/dropdown/dropdown.module';
import { AlmEditableModule } from './src/app/editable/almeditable.module';
import { AlmIconModule } from './src/app/icon/almicon.module';
import { InfiniteScrollModule } from './src/app/infinitescroll/infinitescroll.module';

import { AlmArrayFilter } from './src/app/pipes/alm-array-filter.pipe';
import { AlmAvatarSize } from './src/app/pipes/alm-avatar-size.pipe';
import { AlmFilterBoardList } from './src/app/pipes/alm-board-filter.pipe';
import { AlmLinkTarget } from './src/app/pipes/alm-link-target.pipe';
import { AlmMomentTime } from './src/app/pipes/alm-moment-time.pipe';
import { AlmSearchHighlight } from './src/app/pipes/alm-search-highlight.pipe';
import { AlmTrim } from './src/app/pipes/alm-trim';
import { AlmUserName } from './src/app/pipes/alm-user-name.pipe';
import { AlmValidLinkTypes } from './src/app/pipes/alm-valid-link-types.pipe';

export * from './src/app/container-toggler/container-toggler.module';
export * from './src/app/dialog/dialog.module';
export * from './src/app/dropdown/dropdown.module';
export * from './src/app/editable/almeditable.module';
export * from './src/app/icon/almicon.module';
export * from './src/app/infinitescroll/infinitescroll.module';

export { AlmArrayFilter } from './src/app/pipes/alm-array-filter.pipe';
export { AlmAvatarSize } from './src/app/pipes/alm-avatar-size.pipe';
export { AlmFilterBoardList } from './src/app/pipes/alm-board-filter.pipe';
export { AlmLinkTarget } from './src/app/pipes/alm-link-target.pipe';
export { AlmMomentTime } from './src/app/pipes/alm-moment-time.pipe';
export { AlmSearchHighlight } from './src/app/pipes/alm-search-highlight.pipe';
export { AlmTrim } from './src/app/pipes/alm-trim';
export { AlmUserName } from './src/app/pipes/alm-user-name.pipe';
export { AlmValidLinkTypes } from './src/app/pipes/alm-valid-link-types.pipe';


@NgModule({
  imports: [
    FormsModule,
    Http,
    HttpModule,
    ReactiveFormsModule
  ],
  declarations: [

  ],
  exports: [
    AlmArrayFilter,
    AlmAvatarSize,
    AlmFilterBoardList,
    AlmLinkTarget,
    AlmMomentTime,
    AlmSearchHighlight,
    AlmTrim,
    AlmUserName,
    AlmValidLinkTypes,

    ContainerTogglerModule,
    DialogModule,
    DropdownModule,
    AlmEditableModule,
    AlmIconModule,
    InfiniteScrollModule
  ]
})
export class WidgetsModule {
  // static forRoot(providedLoader: any = {
  //   provide: TranslateLoader,
  //   useFactory: translateLoaderFactory,
  //   deps: [Http]
  // }): ModuleWithProviders {
  //   return {
  //     ngModule: WidgetsModule,
  //     providers: [
  //       providedLoader,
  //       TranslateService,
  //       { provide: TranslateParser, useClass: DefaultTranslateParser }
  //     ]
  //   };
  // }
}