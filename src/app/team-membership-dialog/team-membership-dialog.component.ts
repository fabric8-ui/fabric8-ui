import { DummyService } from './../dummy/dummy.service';
import { Broadcaster } from './../shared/broadcaster.service';
import { User } from './../models/user';
import { Team } from './../models/team';
import { ContextService } from './../shared/context.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'team-membership-dialog',
  templateUrl: './team-membership-dialog.component.html',
  styleUrls: ['./team-membership-dialog.component.scss']
})
export class TeamMembershipDialogComponent {

  public searchString: string;

  constructor(
    public dummy: DummyService,
    private context: ContextService,
    private broadcaster: Broadcaster

  ) { }

  get team(): Team {
    return this.context.current.space.defaultTeam;
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
