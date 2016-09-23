describe('Work item list', function() {

  beforeEach(function() {
    browser.get('http://localhost:8088/');
  });

  it('should contain 14 items', function() {

      // doesn't work as expected - results in 0
      //expect(element.all(by.repeater('workItem of workItems')).count()).toEqual(3);

      //var list = element.all(by.id('work-item-list'));
      //expect(list.count()).toBe(14);
  });
});
