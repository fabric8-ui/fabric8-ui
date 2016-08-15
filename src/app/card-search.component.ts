import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';

import { Observable }        from 'rxjs/Observable';
import { Subject }           from 'rxjs/Subject';

import { CardSearchService } from './card-search.service';
import { Card } from './card';

@Component({
    selector: 'card-search',
    templateUrl: '/card-search.component.html',
    styleUrls:  ['/card-search.component.css'],
    providers: [CardSearchService]
})
export class CardSearchComponent implements OnInit {
    cards: Observable<Card[]>;
    private searchTerms = new Subject<string>();

    constructor(
        private cardSearchService: CardSearchService,
        private router: Router) {}

    // Push a search term into the observable stream.
    search(term: string) { this.searchTerms.next(term); }

    ngOnInit() {
        this.cards = this.searchTerms
            .debounceTime(300)        // wait for 300ms pause in events
            .distinctUntilChanged()   // ignore if next search term is same as previous
            .switchMap(term => term   // switch to new observable each time
                // return the http search observable
                ? this.cardSearchService.search(term)
                // or the observable of empty heroes if no search term
                : Observable.of<Card[]>([]))
            .catch(error => {
                // TODO: real error handling
                console.log(error);
                return Observable.of<Card[]>([]);
            });
    }

    gotoDetail(card: Card) {
        let link = ['/detail', card.id];
        this.router.navigate(link);
    }
}
