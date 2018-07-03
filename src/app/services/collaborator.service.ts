import { Inject, Injectable } from '@angular/core';
import { User } from 'ngx-login-client';
import { Observable } from 'rxjs/Observable';
import { HttpClientService } from './http.service';


@Injectable()
export class CollaboratorService {
  constructor(private http: HttpClientService) {}

  getCollaborators(url: string): Observable<User[]> {
    return this.http.get(url)
      .map(resp => resp.data);
  }
}
