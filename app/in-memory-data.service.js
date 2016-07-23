"use strict";
var InMemoryDataService = (function () {
    function InMemoryDataService() {
    }
    InMemoryDataService.prototype.createDb = function () {
        var cards = [
            { id: 21, name: 'Bullet Chart', description: 'Bullet Chart - Conceptual Design' },
            { id: 22, name: 'New Account', description: 'Create a New Account' },
            { id: 23, name: 'Login page', description: 'Login page should recognize when caps lock is on and throw a warning message' },
            { id: 24, name: 'Splitter', description: 'Splitter - Expand/Collapse snap control' },
            { id: 25, name: 'Integrate', description: 'Integrate PatternFly UI elements' },
            { id: 26, name: 'Log Viewer', description: 'Log Viewer - Conceptual Design' },
            { id: 13, name: 'Bootstrap', description: 'PatternFly and Bootstrap 4' },
            { id: 14, name: 'Travis', description: 'Investigate Travis CI Integration' },
            { id: 15, name: 'Links', description: 'Broken Links' },
            { id: 16, name: 'Best Practice', description: 'Code Organization and Best Practice' },
            { id: 17, name: 'Max Width', description: 'Max Width Container' },
            { id: 18, name: 'Font', description: 'Improve Font Weight Management Across Less File' },
            { id: 19, name: 'Color', description: 'Improve Color Management' },
            { id: 20, name: 'Empty State', description: 'Empty State - Additional Layout Example' }
        ];
        return { cards: cards };
    };
    return InMemoryDataService;
}());
exports.InMemoryDataService = InMemoryDataService;
//# sourceMappingURL=in-memory-data.service.js.map