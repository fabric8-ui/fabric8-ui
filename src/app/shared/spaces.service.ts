import { ConnectableObservable } from 'rxjs/observable/ConnectableObservable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Injectable } from '@angular/core';

import { LocalStorageService } from 'angular-2-local-storage';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { Spaces, Contexts, Space, SpaceService } from 'ngx-fabric8-wit';

interface RawSpace {
  user: string;
  space: string;
}

@Injectable()
export class SpacesService implements Spaces {

  static readonly RECENT_SPACE_LENGTH = 8;
  private static readonly RECENT_SPACE_KEY = 'recentSpaces';

  private _current: Observable<Space>;
  private _recent: ConnectableObservable<Space[]>;

  constructor(
    private contexts: Contexts,
    private localStorage: LocalStorageService,
    private spaceService: SpaceService
  ) {
    this._current = contexts.current
      .map(val => val.space);
    // Create the recent context list
    let addRecent = new Subject<Space>();
    contexts.current
      // Skip any undefined spaces
      .skipWhile(val => (!val.space))
      .map(val => val.space)
      .subscribe(val => addRecent.next(val));
    this._recent = addRecent
      // Map from the context being added to an array of recent contexts
      // The scan operator allows us to access the list of recent contexts and add ours
      .scan((recent, s) => {
        // First, check if this context is already in the list
        // If it is, remove it, so we don't get duplicates
        for (let i = recent.length - 1; i >= 0; i--) {
          if (recent[i].id === s.id) {
            recent.splice(i, 1);
          }
        }
        // Then add this context to the top of the list
        recent.unshift(s);
        return recent;
        // The final value to scan is the initial value, used when the app starts
      },
      [])
      // Finally save the list of recent contexts
      .do(val => {
        // Truncate the number of recent contexts to the correct length
        if (val.length > SpacesService.RECENT_SPACE_LENGTH) {
          val.splice(
            SpacesService.RECENT_SPACE_LENGTH,
            val.length - SpacesService.RECENT_SPACE_LENGTH
          );
        }
      })
      .do(val => {
        this.saveRecent(val);
      })
      .multicast(() => new ReplaySubject(1));
    this._recent.connect();
    this.loadRecent(addRecent);
  }

  get current(): Observable<Space> {
    return this._current;
  }

  get recent(): Observable<Space[]> {
    return this._recent;
  }

  private loadRecent(addRecent: Subject<Space>): Space[] {
    let res: Space[] = [];
    if (this.localStorage.get(SpacesService.RECENT_SPACE_KEY)) {
      for (let raw of this.localStorage.get<RawSpace[]>(SpacesService.RECENT_SPACE_KEY)) {
        if (raw.space) {
          this.loadSpace(raw.user, raw.space)
            .subscribe(val => addRecent.next(val));
        }
      }
    }
    return res;
  }

  private saveRecent(recent: Space[]) {
    let res: RawSpace[] = [];
    for (let s of recent) {
      res.push({
        user: s.relationalData.creator.attributes.username,
        space: (s.attributes.name)
      } as RawSpace);
    }
    this.localStorage.set(SpacesService.RECENT_SPACE_KEY, res);
  }

  private loadSpace(userName: string, spaceName: string): Observable<Space> {
    if (userName && spaceName) {
      return this.spaceService.getSpaceByName(userName, spaceName);
    } else {
      return Observable.of({} as Space);
    }
  }

}
