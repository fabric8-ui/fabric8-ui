import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Card } from './card';
import { CardService } from './card.service';

@Component({
  selector: 'my-board',
  templateUrl: '/board.component.html',
  styleUrls: ['/board.component.css']
})
export class BoardComponent implements OnInit {
  cards: Card[] = [];

  constructor(
    private router: Router,
    private cardService: CardService) {
  }

  ngOnInit() {
    this.cardService.getCards()
        .then(cards => this.cards = cards);
  }

  gotoDetail(card: Card) {
    let link = ['/detail', card.id];
    this.router.navigate(link);
  }
}
