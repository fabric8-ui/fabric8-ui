"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var http_1 = require("@angular/http");
require('rxjs/add/operator/toPromise');
var CardService = (function () {
    function CardService(http) {
        this.http = http;
        this.cardListUrl = 'src/app/workItems'; // URL to web api
    }
    CardService.prototype.handleError = function (error) {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    };
    CardService.prototype.getCards = function () {
        return this.http.get(this.cardListUrl)
            .toPromise()
            .then(function (response) { return response.json().data; })
            .catch(this.handleError);
    };
    // Add new Card
    CardService.prototype.post = function (card) {
        var headers = new http_1.Headers({
            'Content-Type': 'application/json' });
        return this.http
            .post(this.cardListUrl, JSON.stringify(card), { headers: headers })
            .toPromise()
            .then(function (res) { return res.json().data; })
            .catch(this.handleError);
    };
    // Update existing Card
    CardService.prototype.put = function (card) {
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        var url = this.cardListUrl + "/" + card.id;
        return this.http
            .put(url, JSON.stringify(card), { headers: headers })
            .toPromise()
            .then(function () { return card; })
            .catch(this.handleError);
    };
    CardService.prototype.delete = function (card) {
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        var url = this.cardListUrl + "/" + card.id;
        return this.http
            .delete(url, headers)
            .toPromise()
            .catch(this.handleError);
    };
    CardService.prototype.save = function (card) {
        if (card.id) {
            return this.put(card);
        }
        return this.post(card);
    };
    CardService.prototype.getCard = function (id) {
        return this.getCards()
            .then(function (cards) { return cards.find(function (card) { return card.id === id; }); });
    };
    CardService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], CardService);
    return CardService;
}());
exports.CardService = CardService;
//# sourceMappingURL=card.service.js.map