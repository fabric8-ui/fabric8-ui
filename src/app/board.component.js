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
var router_1 = require('@angular/router');
var card_service_1 = require('./card.service');
var BoardComponent = (function () {
    function BoardComponent(router, cardService) {
        this.router = router;
        this.cardService = cardService;
        this.cards = [];
    }
    BoardComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.cardService.getCards()
            .then(function (cards) { return _this.cards = cards.slice(1, 5); });
    };
    BoardComponent.prototype.gotoDetail = function (card) {
        var link = ['/detail', card.id];
        this.router.navigate(link);
    };
    BoardComponent = __decorate([
        core_1.Component({
            selector: 'my-board',
            templateUrl: '/board.component.html',
            styleUrls: ['/board.component.css']
        }), 
        __metadata('design:paramtypes', [router_1.Router, card_service_1.CardService])
    ], BoardComponent);
    return BoardComponent;
}());
exports.BoardComponent = BoardComponent;
//# sourceMappingURL=board.component.js.map