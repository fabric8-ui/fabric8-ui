import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Subject }    from 'rxjs/Subject';

import { WorkItem } from '../work-item';
import { WorkItemSearchService } from './work-item-search.service';

@Component({
  selector: 'alm-work-item-search',
  templateUrl: './work-item-search.component.html',
  styleUrls: ['./work-item-search.component.scss'],
  providers: [WorkItemSearchService]
})
export class WorkItemSearchComponent implements OnInit {
  workItems: Observable<WorkItem[]>;
  private searchTerms = new Subject<string>();

  constructor(
    private workItemSearchService: WorkItemSearchService,
    private router: Router
  ) {}

  // Push a search term into the observable stream.
  search(term: string) {
    this.searchTerms.next(term);
  }

  ngOnInit() {
    this.workItems = this.searchTerms
      .debounceTime(300)    // wait for 300ms pause in events
      .distinctUntilChanged()   // ignore if next search term is same as previous
      .switchMap(term => term   // switch to new observable each time
        // return the http search observable
        ? this.workItemSearchService.search(term)
        // or the observable of empty heroes if no search term
        : Observable.of<WorkItem[]>([]))
      .catch(error => {
        // TODO: real error handling
        console.log(error);
        return Observable.of<WorkItem[]>([]);
      });
  }

  gotoDetail(workItem: WorkItem) {
    let link = ['/detail', workItem.id];
    this.router.navigate(link);
  }
}
