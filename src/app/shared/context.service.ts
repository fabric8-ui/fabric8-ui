import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Broadcaster, User, UserService, Entity } from 'ngx-login-client';
import { Space } from 'ngx-fabric8-wit';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Observable } from 'rxjs/Observable';

import { Context } from './../models/context';
import { ContextType } from './../models/context-type';
import { DummyService } from './../shared/dummy.service';
import { Navigation } from './../models/navigation';

/*
 * A shared service that manages the users current context. The users context is defined as the
 * entity (user or org) and space that they are operating on.
 *
 */
@Injectable()
export class ContextService {

  readonly RECENT_CONTEXT_LENGTH = 8;

  private _current: Observable<Context>;
  private _default: Observable<Context>;
  private _recent: Observable<Context[]>;

  constructor(
    private dummy: DummyService,
    private router: Router,
    private broadcaster: Broadcaster,
    private user: UserService) {

    let addRecent = new Subject<Context>();
    // Initialize the default context when the logged in user changes
    this._default = this.broadcaster.on<User>('currentUserChanged')
      // First use map to convert the broadcast event to just a username
      .map(val => {
        if (val.attributes.username) {
          return val.attributes.username;
        } else {
          console.log('No username attached to user', val);
          throw 'Unknown user';
        }
      })
      // Then, perform another map to create a context from the user
      .map(val => {
        let ctx = {
          'entity': this.dummy.lookupEntity(val),
          'space': null,
          'type': 'user',
          'name': val,
          'path': '/' + val
        } as Context;
        return ctx;
      })
      // Ensure the menus are built
      .do(val => {
        this.buildContextMenus(val);
      });
    // Subscribe the the default context to the recent space collector
    this._default.subscribe(addRecent);

    // Compute the current context
    this._current = Observable
      // use combineLatest to give us both the default context and the current
      // context computed from a navigation
      .combineLatest(
      // First, the navigation event
      this.broadcaster.on<Navigation>('navigate')
        // Eliminate duplicate navigation events
        // TODO this doesn't work quite perfectly
        .distinctUntilKeyChanged('url')
        // Use a map to convert from a navigation url to a context
        .map(val => this.computeContext()),
      // Then, the default context
      this._default,
      // Finally, the projection, which allows us to select the default
      // if the comouted context is null
      (c, d) => c || d)
      // Broadcast the spaceChanged event
      .do(val => {
        if (val.space) {
          this.broadcaster.broadcast('spaceChanged', val.space);
        }
      })
      // Ensure the menus are built
      .do(val => {
        this.buildContextMenus(val);
      });
    // Subscribe the current context to the revent space collector
    this._current.subscribe(addRecent);

    // Create the recent space list
    this._recent = addRecent
      // Map from the context being added to an array of recent contexts
      // The scan operator allows us to access the list of recent contexts and add ours
      .scan((recent, ctx) => {
        // First, check if this context is already in the list
        // If it is, remove it, so we don't get duplicates
        for (let i = recent.length - 1; i >= 0; i--) {
          if (recent[i].path === ctx.path) {
            recent.splice(i, 1);
          }
        }
        // Then add this context to the top of the list
        recent.unshift(ctx);
        return recent;
        // The final value to scan is the initial value, used when the app starts
      }, this.dummy.recent)
      .do(val => {
        // Truncate the number of recent contexts to the correct length
        if (val.length > this.RECENT_CONTEXT_LENGTH) {
          val.splice(
            this.RECENT_CONTEXT_LENGTH,
            val.length - this.RECENT_CONTEXT_LENGTH
          );
        }
      })
      // Finally save the list of recent contexts
      .do(val => {
        this.dummy.recent = val;
        this.broadcaster.broadcast('save');
      });

  }

  get recent(): Observable<Context[]> {
    return this._recent;
  }

  get current(): Observable<Context> {
    return this._current;
  }

  lookupContextType(type: string): ContextType {
    let ct = this.dummy.CONTEXT_TYPES.get(type);
    // Make a copy of the context type before returning
    return ct ? JSON.parse(JSON.stringify(ct)) : null;
  }

  get currentUser(): User {
    return this.dummy.currentUser;
  }

  private buildContextMenus(context: Context) {
    if (typeof context.type === 'string') {
      context.type = this.lookupContextType(context.type);
    }
    if (context.type.menus) {
      for (let n of context.type.menus) {
        n.fullPath = this.buildPath(context.path, n.path);
        if (n.menus) {
          for (let o of n.menus) {
            o.fullPath = this.buildPath(context.path, n.path, o.path);
          }
        }
      }
    }
  }

  private computeContext(): Context {
    // First, check if there is a recent context
    let entityStr: string = this.extractEntity();
    let spaceStr: string = this.extractSpace();
    if (this.checkForReservedWords(entityStr) || this.checkForReservedWords(spaceStr)) {
      return null;
    }
    // TODO Implement team URLs
    let teamStr: string = null;
    // The 'ctxPath' is the raw path to the context only, with all extraneous info removed
    let ctxPath = '';
    if (entityStr) {
      ctxPath = '/' + entityStr;
    }
    if (spaceStr) {
      ctxPath = ctxPath + '/' + spaceStr;
    }
    if (!ctxPath) {
      return null;
    }

    // Otherwise, we have to build it
    return this.buildContext();
  }

  private buildContext() {
    let c: Context = {
      'entity': this.loadEntity(),
      'space': this.loadSpace(),
      'type': null,
      'name': null,
      'path': null
    } as Context;
    // TODO Support other types of entity
    if (c.entity && c.space) {
      c.type = 'space';
      c.path = '/' + (<User>c.entity).attributes.username + '/' + c.space.attributes.name;
      c.name = c.space.attributes.name;
    } else if (c.entity) {
      c.type = 'user';
      // TODO replace path with username once parameterized routes are working
      c.path = '/' + (<User>c.entity).attributes.username;
      c.name = (<User>c.entity).attributes.username;
    } // TODO add type detection for organization and team
    if (c.type != null) {
      this.buildContextMenus(c);
      return c;
    }
  }

  private extractEntity(): string {
    let params = this.getRouteParams();
    if (params) {
      return params["entity"];
    }
    return null;
  }

  private loadEntity(): Entity {
    return this.dummy.lookupEntity(this.extractEntity());
  }

  private extractSpace(): string {
    let params = this.getRouteParams();
    if (params) {
      return params["space"];
    }
    return null;
  }

  private getRouteParams(): any {
    if (this.router && this.router.routerState && this.router.routerState.snapshot && this.router.routerState.snapshot.root && this.router.routerState.snapshot.root.firstChild) {
      return this.router.routerState.snapshot.root.firstChild.params;
    }
    return null;
  }

  private loadSpace(): Space {
    return this.dummy.lookupSpace(this.extractSpace());
  }

  private checkForReservedWords(arg: string): boolean {
    if (arg) {
      // All words starting with _ are reserved
      if (arg.startsWith('_')) {
        return true;
      }
      for (let r of this.dummy.RESERVED_WORDS) {
        if (arg === r) {
          return true;
        }
      }
    }
    return false;
  }

  private buildPath(...args: string[]): string {
    let res = '';
    for (let p of args) {
      if (p.startsWith('/')) {
        res = p;
      } else {
        res = res + '/' + p;
      }
      res = res.replace(/\/*$/, '');
    }
    return res;
  }

}
