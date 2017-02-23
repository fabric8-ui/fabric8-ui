import { Observable } from 'rxjs/Observable';

export class GlobalSettings {

  public inTestMode$: Observable<boolean>;
  private observer: any;

  constructor() {
    this.inTestMode$ = new Observable<boolean>(observer => this.observer = observer);
  }

  public setTestMode(mode: boolean) {
    if (this.observer) {
      this.observer.next(mode);
    }
  }

}
