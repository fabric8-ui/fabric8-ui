import { Observable, Subject } from 'rxjs';
import { UserService } from 'ngx-login-client';
import { SpaceService } from 'ngx-fabric8-wit';
import { SimpleChanges, OnChanges, Directive, Input, forwardRef } from '@angular/core';
import { AbstractControl, Validators, Validator, NG_ASYNC_VALIDATORS, AsyncValidatorFn } from '@angular/forms';
@Directive({
  selector: '[uniqueSpaceName][ngModel]',
  providers: [{ provide: NG_ASYNC_VALIDATORS, useExisting: forwardRef(() => UniqueSpaceNameValidatorDirective), multi: true }]
})
export class UniqueSpaceNameValidatorDirective implements Validator, OnChanges {


  @Input() uniqueSpaceName: boolean;

  private valFn;

  constructor(private spaceService: SpaceService, private userService: UserService) {

  }

  ngOnChanges(changes: SimpleChanges): void {
    let change = changes['uniqueSpaceName'];
    if (change) {
      this.valFn = uniqueSpaceNameValidator(this.spaceService, this.userService);
    } else {
      this.valFn = Validators.nullValidator;
    }
  }

  validate(control: AbstractControl): Observable<{ [key: string]: any }> {
    return this.valFn(control);
  }

}

export function uniqueSpaceNameValidator(spaceService: SpaceService, userService: UserService): AsyncValidatorFn {

  let changed$ = new Subject<any>();

  return (control: AbstractControl): Observable<{ [key: string]: any }> => {
    changed$.next();
    return control.valueChanges
      .debounceTime(200)
      .distinctUntilChanged()
      .takeUntil(changed$)
      .switchMap(value => userService
        .getUser()
        .switchMap(user => {
          return spaceService
            .getSpaceByName(user.attributes.username, control.value)
            .map(val => {
              return { unique: { valid: false, existingSpace: val, requestedName: control.value } };
            })
            .catch(val => {
              return Observable.of(null);
            });
        }))
        .first();
  };
}
