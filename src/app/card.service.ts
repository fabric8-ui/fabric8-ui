import { Injectable } from '@angular/core';
import {Headers,Http} from "@angular/http";

import 'rxjs/add/operator/toPromise';
import { Card } from './card';

@Injectable()
export class CardService {
  private cardListUrl = 'app/workItems';  // URL to web api

  constructor(private http: Http) { }

  getCards(): Promise<Card[]> {
    return this.http.get(this.cardListUrl)
      .toPromise()
      .then(response => response.json().data as Card[])
      .catch(this.handleError);
  }

  getCard(id: number) {
    return this.getCards()
        .then(cards => cards.find(card => card.id === id));
  }

  save(card: Card): Promise<Card>  {
    if (card.id) {
      return this.put(card);
    }
    return this.post(card);
  }

  delete(card: Card) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    let url = `${this.cardListUrl}/${card.id}`;

    return this.http
        .delete(url, {headers: headers})
        .toPromise()
        .catch(this.handleError);
  }

  // Add new Card
  private post(card: Card): Promise<Card> {
    let headers = new Headers({
      'Content-Type': 'application/json'});

    return this.http
      .post(this.cardListUrl, JSON.stringify(card), {headers: headers})
      .toPromise()
      .then(res => res.json().data)
      .catch(this.handleError);
  }

  // Update existing Card
  private put(card: Card) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    let url = `${this.cardListUrl}/${card.id}`;

    return this.http
      .put(url, JSON.stringify(card), {headers: headers})
      .toPromise()
      .then(() => card)
      .catch(this.handleError);
  }

  private handleError(error: any) {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

}
