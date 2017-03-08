import { SpacesService } from './spaces.service';
import { Injectable } from '@angular/core';
@Injectable()
export class SpacesServiceFactory {

  constructor(public spacesService: SpacesService) {

  }

}
