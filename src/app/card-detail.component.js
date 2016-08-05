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
var card_1 = require('./card');
var card_service_1 = require('./card.service');
var CardDetailComponent = (function () {
    function CardDetailComponent(cardService, route) {
        this.cardService = cardService;
        this.route = route;
        this.close = new core_1.EventEmitter();
        this.navigated = false; // true if navigated here
    }
    CardDetailComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.sub = this.route.params.subscribe(function (params) {
            if (params['id'] !== undefined) {
                var id = +params['id'];
                _this.navigated = true;
                _this.cardService.getCard(id)
                    .then(function (card) { return _this.card = card; });
            }
            else {
                _this.navigated = false;
                _this.card = new card_1.Card();
            }
        });
    };
    CardDetailComponent.prototype.ngOnDestroy = function () {
        this.sub.unsubscribe();
    };
    CardDetailComponent.prototype.save = function () {
        var _this = this;
        this.cardService
            .save(this.card)
            .then(function (card) {
            _this.card = card; // saved card, w/ id if new
            _this.goBack(card);
        })
            .catch(function (error) { return _this.error = error; }); // TODO: Display error message
    };
    CardDetailComponent.prototype.goBack = function (savedCard) {
        if (savedCard === void 0) { savedCard = null; }
        this.close.emit(savedCard);
        if (this.navigated) {
            window.history.back();
        }
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', card_1.Card)
    ], CardDetailComponent.prototype, "card", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], CardDetailComponent.prototype, "close", void 0);
    CardDetailComponent = __decorate([
        core_1.Component({
            selector: 'card-detail',
            templateUrl: '/card-detail.component.html',
            styleUrls: ['/card-detail.component.css']
        }), 
        __metadata('design:paramtypes', [card_service_1.CardService, router_1.ActivatedRoute])
    ], CardDetailComponent);
    return CardDetailComponent;
}());
exports.CardDetailComponent = CardDetailComponent;
//# sourceMappingURL=card-detail.component.js.map