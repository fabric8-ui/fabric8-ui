import { Injectable } from '@angular/core';

import { Toggle } from './toggle';
import { TOGGLES } from './toggle-options';

@Injectable()
export class ToggleService {
  private _featureToggle: Toggle;

  getToggles(): Promise<Toggle[]> {
    return Promise.resolve(TOGGLES)
  }

  get featureToggle(): Toggle {
    return this._featureToggle;
  }

  set featureToggle(newToggle: Toggle) {
    this._featureToggle = newToggle;
  }

}
