import { TestBed } from '@angular/core/testing'
import { provideMockActions } from '@ngrx/effects/testing'
import { hot, cold } from 'jasmine-marbles';

import { InfotipEffects } from './infotip.effects';
import { InfotipService } from '../services/infotip.service';
import { Observable } from 'rxjs';
import * as Actions from '../actions/infotip.actions';
import { Action } from 'rxjs/scheduler/Action';
import { InfotipState } from '../states/infotip.state';

describe('InfotipEffects', () => {
  let effects: InfotipEffects;
  let actions: Observable<any>;
  let infotipService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [

      ],
      providers: [
        InfotipEffects,
        provideMockActions(() => actions),
        {
          provide: InfotipService,
          useValue: jasmine.createSpyObj('infotipService', ['getInfotips'])
        }
      ]
    });

    effects = TestBed.get(InfotipEffects);
    infotipService = TestBed.get(InfotipService);
  });

  it("should fetch infotips", () => {
    let payload: InfotipState = { 
      "6cff4ab8-c380-4aa9-9980-17b6f223d181": {
        "term": "alternate dependency",
        "en": "Dependencies recommended by OpenShift.io to replace restrictive licenses or usage outliers."
      } 
    };
    const action = new Actions.Get();
    const success = new Actions.GetSuccess(payload);
    
    infotipService.getInfotips.and.returnValue(Observable.of(payload));

    actions = hot('--a-', { a: action });
    const expected = cold('--b', { b: success });

    expect(effects.getInfotips$).toBeObservable(expected);
  });

  it("should dispatch an error action", () => {
    const action = new Actions.Get();
    const error = new Actions.GetError();

    infotipService.getInfotips.and.returnValue(Observable.throw(new Error()));

    actions = hot('--a-', { a: action });
    const expected = cold('--b', { b: error });

    expect(effects.getInfotips$).toBeObservable(expected);
  })
});