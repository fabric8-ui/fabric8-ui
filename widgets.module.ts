import { NotificationModule } from './src/app/notification/notification.module';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ContainerTogglerModule } from './src/app/container-toggler/container-toggler.module';
import { DialogModule } from './src/app/dialog/dialog.module';
import { DropdownModule } from './src/app/dropdown/dropdown.module';
import { AlmEditableModule } from './src/app/editable/almeditable.module';
import { AlmIconModule } from './src/app/icon/almicon.module';
import { FiltersModule } from './src/app/filters/filters.module';
import { InfiniteScrollModule } from './src/app/infinitescroll/infinitescroll.module';
import { SortModule } from './src/app/sort/sort.module';
import { TreeListModule } from './src/app/treelist/treelist.module';
import { ToolbarModule } from './src/app/toolbar/toolbar.module';

import { AlmArrayFilter } from './src/app/pipes/alm-array-filter.pipe';
import { AlmAvatarSize } from './src/app/pipes/alm-avatar-size.pipe';
import { AlmLinkTarget } from './src/app/pipes/alm-link-target.pipe';
import { AlmMomentTime } from './src/app/pipes/alm-moment-time.pipe';
import { AlmSearchHighlight } from './src/app/pipes/alm-search-highlight.pipe';
import { AlmTrim } from './src/app/pipes/alm-trim';
import { ArrayCount } from './src/app/pipes/arrayCount.pipe';


@NgModule({
  imports: [
    FormsModule
  ],
  declarations: [
    AlmArrayFilter,
    AlmAvatarSize,
    AlmLinkTarget,
    AlmMomentTime,
    AlmSearchHighlight,
    AlmTrim,
    ArrayCount
  ],
  exports: [
    AlmArrayFilter,
    AlmAvatarSize,
    AlmLinkTarget,
    AlmMomentTime,
    AlmSearchHighlight,
    AlmTrim,
    ArrayCount,

    AlmEditableModule,
    AlmIconModule,
    ContainerTogglerModule,
    DialogModule,
    DropdownModule,
    FiltersModule,
    InfiniteScrollModule,
    NotificationModule,
    SortModule,
    TreeListModule,
    ToolbarModule
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
