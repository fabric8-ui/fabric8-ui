import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { GitHubLinkService } from './github-link.service';
import { GitHubLinkAreaComponent } from './github-link-area.component';

/**
 * A module containing objects associated with the GitHubLinkArea component
 */
@NgModule({
  imports: [ CommonModule, HttpClientModule ],
  declarations: [ GitHubLinkAreaComponent ],
  providers: [ GitHubLinkService ],
  exports: [ GitHubLinkAreaComponent ]
})
export class GitHubLinkAreaModule { }
