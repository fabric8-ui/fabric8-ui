import { Observable } from 'rxjs';

import { Injectable } from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

/**
 * This provides a very simple retrieval of issue information from
 * GitHub. It uses the non-authorized public API of GitHub, so it
 * is rate-limited (to 60 requests/hr currently). To avoid as much
 * requests as possible, the request responses are cached here.
 */
@Injectable()
export class GitHubLinkService {

  private linkCache: any[] = [];

  constructor(private http: HttpClient) {}

  /*
   * This retrieves GitHub JSON information for a given remote GH issue. The given
   * linkData needs to contain 'org', 'repo' and 'issue' that refers to a GitHub issue.
   * The returned data is cached with infinite holding time, effectively only querying
   * once for every GitHub issue for the entire runtime of the service. This is needed
   * because GitHub is enforcing a strict rate limiting.
   */
  getIssue(linkData: any): Observable<any> {
    let cachedData = this.findInCache(linkData);
    if (cachedData) {
      return Observable.of(cachedData);
    } else {
      let query: Observable<any> = this.http.get(
        'https://api.github.com/repos/' +
        linkData.org + '/' +
        linkData.repo +
        '/issues/' + linkData.issue)
      .catch(error => {
        return Observable.of({state: 'error'});
      });
      query.subscribe(data => {
        this.linkCache.push(data);
      });
      return query;
    }
  }

  private findInCache(linkData: any): any {
    for (let i = 0; i < this.linkCache.length; i++) {
      let link = this.linkCache[i];
      if (link.url === 'https://api.github.com/repos/' +
            linkData.org + '/' +
            linkData.repo + '/issues/' +
            linkData.issue) {
          linkData.state = link.state;
          return linkData;
      }
    }
    return null;
  }
}
