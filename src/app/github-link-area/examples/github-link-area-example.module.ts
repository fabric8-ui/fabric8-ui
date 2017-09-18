import { NgModule }  from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { GitHubLinkAreaModule } from '../github-link-area.module';
import { GitHubLinkAreaExampleComponent } from './github-link-area-example.component';

@NgModule({
  declarations: [ GitHubLinkAreaExampleComponent ],
  imports: [ CommonModule, RouterModule, FormsModule, GitHubLinkAreaModule ],
})
export class GitHubLinkAreaExampleModule {
  constructor() {}
}
