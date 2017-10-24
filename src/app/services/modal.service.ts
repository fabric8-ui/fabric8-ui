import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class ModalService {

  private clientSource = new Subject<string>();
  private componentSource = new Subject<string[]>();
  private clientSource$ = this.clientSource.asObservable();
  private componentSource$ = this.componentSource.asObservable();

  constructor() {}

  public openModal(title: string, message: string, buttonText: string, actionKey?: string): Observable<string> {
    this.componentSource.next([ title, message, buttonText, actionKey ]);
    return this.clientSource$;
  }

  public doAction(actionKey: string) {
    this.clientSource.next(actionKey);
  }

  public getComponentObservable(): Observable<string[]> {
    return this.componentSource$;
  }
}
