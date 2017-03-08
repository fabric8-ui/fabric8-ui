import { Observable, Subject, ReplaySubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Spaces, Space } from 'ngx-fabric8-wit';

@Injectable()
export class SpacesService implements Spaces {

  private _current: Subject<Space> = new ReplaySubject(1);

  get current(): Observable<Space> {
    return this._current.asObservable();
  }

  setCurrent(space: Space) {
    this._current.next(space);
  }

}
