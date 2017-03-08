import { Observable } from 'rxjs';
import { Spaces, Contexts, Space } from 'ngx-fabric8-wit';
import { Injectable } from '@angular/core';

@Injectable()
export class SpacesService implements Spaces {

  private _current: Observable<Space>;

  constructor(private contexts: Contexts) {
    this._current = contexts.current
      .map(val => val.space);
  }

  get current(): Observable<Space> {
    return this._current;
  }

}
