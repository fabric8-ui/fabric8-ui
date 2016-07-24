"use strict";
var router_1 = require('@angular/router');
var cards_component_1 = require('./cards.component');
var board_component_1 = require("./board.component");
var card_detail_component_1 = require("./card-detail.component");
var routes = [
    {
        path: 'cards',
        component: cards_component_1.CardsComponent
    },
    {
        path: 'board',
        component: board_component_1.BoardComponent
    },
    {
        path: '',
        redirectTo: '/cards',
        pathMatch: 'full'
    },
    {
        path: 'detail/:id',
        component: card_detail_component_1.CardDetailComponent
    },
];
exports.appRouterProviders = [
    router_1.provideRouter(routes)
];
//# sourceMappingURL=app.routes.js.map