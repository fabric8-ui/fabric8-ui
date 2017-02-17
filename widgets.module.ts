// import './rxjs-extensions';

import { NgModule, Pipe } from '@angular/core';
import { FormsModule } from '@angular/forms';

// import { DropdownModule } from 'ngx-dropdown';

import { ContainerTogglerModule } from './src/app/container-toggler/container-toggler.module';
import { DialogModule } from './src/app/dialog/dialog.module';
import { DropdownModule } from './src/app/dropdown/dropdown.module';
import { AlmEditableModule } from './src/app/editable/almeditable.module';
import { AlmIconModule } from './src/app/icon/almicon.module';
import { InfiniteScrollModule } from './src/app/infinitescroll/infinitescroll.module';

import { AlmArrayFilter } from './src/app/pipes/alm-array-filter.pipe';
import { AlmAvatarSize } from './src/app/pipes/alm-avatar-size.pipe';
import { AlmLinkTarget } from './src/app/pipes/alm-link-target.pipe';
import { AlmSearchHighlight } from './src/app/pipes/alm-search-highlight.pipe';
import { AlmTrim } from './src/app/pipes/alm-trim';


// export { ContainerTogglerModule } from './src/app/container-toggler/container-toggler.module';
// export { DialogModule } from './src/app/dialog/dialog.module';
// export { DropdownModule } from './src/app/dropdown/dropdown.module';
// export { AlmEditableModule } from './src/app/editable/almeditable.module';
// export { AlmIconModule } from './src/app/icon/almicon.module';
// export { InfiniteScrollModule } from './src/app/infinitescroll/infinitescroll.module';

// export { AlmArrayFilter } from './src/app/pipes/alm-array-filter.pipe';
// export { AlmAvatarSize } from './src/app/pipes/alm-avatar-size.pipe';
// export { AlmLinkTarget } from './src/app/pipes/alm-link-target.pipe';
// export { AlmSearchHighlight } from './src/app/pipes/alm-search-highlight.pipe';
// export { AlmTrim } from './src/app/pipes/alm-trim';


@NgModule({
  imports: [
    FormsModule
  ],
  declarations: [
    AlmArrayFilter,
    AlmAvatarSize,
    AlmLinkTarget,
    AlmSearchHighlight,
    AlmTrim
  ],
  exports: [
    AlmArrayFilter,
    AlmAvatarSize,
    AlmLinkTarget,
    AlmSearchHighlight,
    AlmTrim,
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