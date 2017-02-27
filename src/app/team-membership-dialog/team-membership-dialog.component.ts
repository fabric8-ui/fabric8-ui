import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Broadcaster, User } from 'ngx-login-client';
import { Team, Space } from 'ngx-fabric8-wit';

import { DummyService } from './../shared/dummy.service';
import { ContextService } from './../shared/context.service';

@Component({
  selector: 'team-membership-dialog',
  templateUrl: './team-membership-dialog.component.html',
  styleUrls: ['./team-membership-dialog.component.scss']
})
export class TeamMembershipDialogComponent implements OnInit{

  public searchString: string;
  public space: Space;

  constructor(
    public dummy: DummyService,
    private context: ContextService,
    private broadcaster: Broadcaster

  ) { }

  ngOnInit() {
    this.context.current.subscribe(val => this.space = val.space);
  }

  get team(): Team {
    return this.space ? this.space.defaultTeam : null;
  }

  remove(remove: User) {
    let res: User[] = new Array<User>();
    for (let u of this.team.members) {
      if (u !== remove) {
        res.push(u);
      }
    }
    this.team.members = res;
    this.broadcaster.broadcast('save', 1);
  }

  add() {
    let add: User;
    for (let u of this.dummy.users) {
      if (u.attributes.username === this.searchString) {
        add = u;
      }
    }
    if (add) {
      // TODO Hacky check to make sure we don't dupe members
      for (let u of this.team.members) {
        if (u === add) {
          // TODO make this a form error
          console.log(this.searchString + ' is already part of the team');
          return;
        }
      }
      this.team.members.push(add);
      this.broadcaster.broadcast('save', 1);
    } else {
      // TODO make this a form error
      console.log(this.searchString + ' not found in user list');
    }
  }
}
