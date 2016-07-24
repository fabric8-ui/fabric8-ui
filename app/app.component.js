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
var cards_component_1 = require('./cards.component');
var board_component_1 = require('./board.component');
var card_detail_component_1 = require('./card-detail.component');
var AppComponent = (function () {
    function AppComponent() {
        this.title = 'Red Hat ALMighty';
    }
    AppComponent = __decorate([
        core_1.Component({
            selector: 'my-app',
            template: "\n    <h1>{{title}}</h1>\n    <nav>\n      <a [routerLink]=\"['/board']\" routerLinkActive=\"active\">Board</a>\n      <a [routerLink]=\"['/cards']\" routerLinkActive=\"active\">Card List</a>\n    </nav>\n    <router-outlet></router-outlet>\n  ",
            styleUrls: ['app/app.component.css'],
            directives: [
                router_1.ROUTER_DIRECTIVES
            ],
            providers: [
                card_service_1.CardService
            ],
            precompile: [
                cards_component_1.CardsComponent,
                board_component_1.BoardComponent,
                card_detail_component_1.CardDetailComponent
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map