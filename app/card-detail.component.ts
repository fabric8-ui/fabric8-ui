import { Component, EventEmitter, Input, OnInit, OnDestroy, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Card } from './card';
import { CardService } from './card.service';

@Component({
  selector: 'card-detail',
  templateUrl: 'app/card-detail.component.html',
  styleUrls: ['app/card-detail.component.css']
})
export class CardDetailComponent implements OnInit, OnDestroy {
  @Input() card: Card;
  @Output() close = new EventEmitter();
  error: any;
  sub: any;
  navigated = false; // true if navigated here

  constructor(
    private cardService: CardService,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      if (params['id'] !== undefined) {
        let id = +params['id'];
        this.navigated = true;
        this.cardService.getCard(id)
          .then(card => this.card = card);
      } else {
        this.navigated = false;
        this.card = new Card();
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  save() {
    this.cardService
      .save(this.card)
      .then(card => {
        this.card = card; // saved card, w/ id if new
        this.goBack(card);
      })
      .catch(error => this.error = error); // TODO: Display error message
  }

  goBack(savedCard: Card = null) {
    this.close.emit(savedCard);
    if (this.navigated) { window.history.back(); }
  }
}
