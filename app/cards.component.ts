import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

import { Card } from './card';
import { CardService } from './card.service';
import { CardDetailComponent } from './card-detail.component';

@Component({
  selector: 'my-cards',
  templateUrl: 'app/cards.component.html',
  styleUrls: ['app/cards.component.css'],
  directives: [CardDetailComponent]
})
export class CardsComponent implements OnInit {
  cards: Card[];
  selectedCard: Card;
  addingCard = false;
  error: any;

  constructor(
    private router: Router,
    private cardService: CardService) {
  }

  getCards() {
    this.cardService.getCards().then(cards => this.cards = cards);
  }

  ngOnInit() {
    this.getCards();
  }

  onSelect(card: Card) { this.selectedCard = card; }

  gotoDetail() {
    this.router.navigate(['/detail', this.selectedCard.id]);
  }

  addCard() {
    this.addingCard = true;
    this.selectedCard = null;
  }

  close(savedCard: Card) {
    this.addingCard = false;
    if (savedCard) { this.getCards(); }
  }

  deleteCard(card: Card, event: any) {
    event.stopPropagation();
    this.cardService
      .delete(card)
      .then(res => {
        this.cards = this.cards.filter(h => h !== card);
        if (this.selectedCard === card) { this.selectedCard = null; }
      })
      .catch(error => this.error = error);
  }
}

