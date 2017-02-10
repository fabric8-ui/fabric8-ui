import { Space } from './../models/space';
import { Entity } from './../models/entity';
import { ContextType } from './../models/context-type';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Broadcaster, User } from 'ngx-login-client';

import { Context } from './../models/context';
import { DummyService } from './../shared/dummy.service';

/*
 * A shared service that manages the users current context. The users context is defined as the
 * entity (user or org) and space that they are operating on.
 *
 */
@Injectable()
export class ContextService {

  readonly RECENT_CONTEXT_LENGTH = 8;

  private _current: Context;
  private _default: Context;

  constructor(
    private dummy: DummyService,
    private router: Router,
    private broadcaster: Broadcaster) {
    // Listen for any context refreshes requested by the app
    this.broadcaster.on<string>('navigate').subscribe(message => {
      this.current = this.computeContext();
    });

    // Initialize the default context when the logged in user changes and add as a recent context
    this.broadcaster.on<User>('currentUserChanged').subscribe(message => {
      if (message.attributes.username) {
        console.log('Initializing default context for ' + message.attributes.username);
        this._default = this.buildContext(message.attributes.username);
        console.log(this._default);
        this.addRecentContext(this._default);
      }
      this.current = this.computeContext();
      // Initialize all recent contexts
      for (let c of this.recent) {
        this.buildContextMenus(c);
      }
    });

  }

  get recent(): Context[] {
    return this.dummy.recent;
  }

  get current(): Context {
    return this._current;
  }

  lookupContextType(type: string): ContextType {
    let ct = this.dummy.CONTEXT_TYPES.get(type);
    // Make a copy of the context type before returning
    return ct ? JSON.parse(JSON.stringify(ct)) : null;
  }

  set current(context: Context) {
    if (!context) {
      context = this._default;
    }
    if (this._current !== context) {
      // If the context changed
      this._current = context;
      this.addRecentContext(context);
    }
  }

  private addRecentContext(context: Context) {
    for (let i = this.recent.length - 1; i >= 0; i--) {
      if (this.recent[i].path === context.path) {
        this.recent.splice(i, 1);
      }
    }
    this.recent.unshift(context);
    // Truncate the context
    if (this.recent.length > this.RECENT_CONTEXT_LENGTH) {
      this.recent.splice(
        this.RECENT_CONTEXT_LENGTH,
        this.recent.length - this.RECENT_CONTEXT_LENGTH
      );
    }
    this.broadcaster.broadcast('save');
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
    let entityStr: string = this.extractEntity(this.router.url);
    let spaceStr: string = this.extractSpace(this.router.url);
    // TODO Implement team URLs
    let teamStr: string = null;
    // TODO This is horrible, make a switch?
    for (let c of this.recent) {
      if (entityStr && c.entity && !c.team && c.entity instanceof User) {
        if (spaceStr && c.space) {
          if (entityStr === (<User>c.entity).attributes.username && spaceStr === c.space.name) {
            return c;
          }
        } else if (!spaceStr && !c.space) {
          if (entityStr === (<User>c.entity).attributes.username) {
            return c;
          }
        }
      }
    }
    // Otherwise, we have to build it
    return this.buildContext(this.router.url);
  }

  private buildContext(path: string) {
    let c: Context = {
      'entity': this.loadEntity(path),
      'space': this.loadSpace(path),
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
      c.path = '/' + (<User>c.entity).attributes.username;
      c.name = (<User>c.entity).attributes.username;
    } // TODO add type detection for organization and team
    if (c.type != null) {
      this.buildContextMenus(c);
      return c;
    }
  }

  private extractEntity(path: string): string {
    let e = this.removeLeadingChars(path, '/').split('/')[0];
    if (e && !this.checkForReservedWords(e)) {
      return e;
    } else {
      return null;
    }
  }

  private loadEntity(path: string): Entity {
    return this.dummy.lookupEntity(this.extractEntity(path));
  }

  private extractSpace(path: string): string {
    let s = this.removeLeadingChars(path, '/').split('/')[1];
    if (s && !this.checkForReservedWords(s)) {
      return s;
    }
    return null;
  }

  private loadSpace(path: string): Space {
    return this.dummy.lookupSpace(this.extractSpace(path));
  }

  private removeLeadingChars(str: string, char: string): string {
    return str.startsWith(char) ? str.slice(1, str.length) : str;
  }

  private checkForReservedWords(arg: string): boolean {
    for (let r of this.dummy.RESERVED_WORDS) {
      if (arg === r) {
        return true;
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
