import { cloneDeep } from 'lodash';
import {
  Component,
  EventEmitter,
  OnInit,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { FilterService } from '../../services/filter.service';
import { Space, Spaces } from 'ngx-fabric8-wit';
import { User } from 'ngx-login-client';

@Component({
  selector: 'f8-assignee',
  templateUrl: './assignee.component.html',
  styleUrls: ['./assignee.component.less']
})

export class AssigneesComponent implements OnInit {
  private assignees: User[] = [];

  @Input('assignees') set assigneeInput(val) {
    this.assignees = val;
  };

  private spaceSubscription: Subscription = null;
  private spaceId;

  constructor(
    private filterService: FilterService,
    private spaces: Spaces
  ){}

  ngOnInit() {
  }
}
