import {
  Component,
  OnInit
} from '@angular/core';

@Component({
  selector: 'github-link-area-example',
  styles: [`
    .sample-form .form-horizontal .form-group {
      margin-left: 0;
    }
    .padding-top-15 {
      padding-top: 15px;
    }
    .padding-bottom-15 {
      padding-bottom: 15px;
    }
  `],
  templateUrl: './github-link-area-example.component.html'
})
export class GitHubLinkAreaExampleComponent implements OnInit {

  content: string = `There is some text in here
    <a href="https://github.com/patternfly/patternfly-ng/issues/127">https://github.com/patternfly/patternfly-ng/issues/127</a>. 
    And some more text. And another issue link:
    <a href="https://github.com/patternfly/patternfly-ng/issues/111" rel="nofollow">https://github.com/patternfly/patternfly-ng/issues/111</a>.
    And for testing purposes, the same link as the first as a dupe:
    <a href="https://github.com/patternfly/patternfly-ng/issues/127" rel="nofollow">https://github.com/patternfly/patternfly-ng/issues/127</a>.
    Note: the link html formatting is following the currently used OSIO server side link markdown formatting. It may need changes
    if used with a different markdown compiler`;

  constructor() {}

  ngOnInit(): void {}
}
