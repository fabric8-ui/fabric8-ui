import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { cloneDeep } from 'lodash';
import { Space, Spaces } from 'ngx-fabric8-wit';
import { User } from 'ngx-login-client';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'f8-assignee',
  templateUrl: './assignee.component.html',
  styleUrls: ['./assignee.component.less']
})

export class AssigneesComponent implements OnInit {
  private assignees: User[] = [];

  @Input() truncateAfter: number;
  @Input() showFullName: boolean;
  @Input('assignees') set assigneeInput(val) {
    this.assignees = val;
  }

  private spaceSubscription: Subscription = null;
  private spaceId;

  constructor(
    private spaces: Spaces
  ) {}

  ngOnInit() {
  }
}
