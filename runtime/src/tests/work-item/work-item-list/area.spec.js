/**Note on screen resolutions - See: http://www.itunesextractor.com/iphone-ipad-resolution.html
 * Tests will be run on these resolutions:
 * - iPhone6s - 375x667
 * - iPad air - 768x1024
 * - Desktop -  1920x1080
 *
 * beforeEach will set the mode to Desktop. Any tests requiring a different resolution will must set explicitly.
 *
 * @author naina-verma
 */

var WorkItemListPage = require('./page-objects/work-item-list.page'),
  constants = require('./constants'),
  testSupport = require('./testSupport');

describe('Area tests :: ', function () {
  var page; 
  var until = protractor.ExpectedConditions;
  var WORKITEM_0_ID = 'id0';
  var WORKITEM_1_ID = 'id1';
  var AREA_ROOT_TITLE = '/Root Area';
  var AREA_0_TITLE = '/Root Area/Area 0';
  var AREA_1_TITLE = '/Root Area/Area 1';

  beforeEach(function () {
    testSupport.setBrowserMode('desktop');
    page = new WorkItemListPage(true);
    testSupport.setTestSpace(page);
    browser.wait(until.elementToBeClickable(page.firstWorkItem), constants.WAIT, 'Failed to find first work item');   
  });

  it('Verify Area elements are present -desktop ', function() {
      var detailPage = page.clickWorkItem(page.firstWorkItem);
      browser.wait(until.elementToBeClickable(detailPage.areaLabel), constants.WAIT, 'Failed to find areaLabel');   
      expect(detailPage.AreaSelect().isPresent()).toBe(true);
     });

  it('Adding area to a WI -desktop ', function() {
      var detailPage = page.clickWorkItem(page.firstWorkItem);
      browser.wait(until.elementToBeClickable(detailPage.areaLabel), constants.WAIT, 'Failed to find areaLabel');   
      detailPage.clickAreaSelect();
      detailPage.clickAreas(WORKITEM_0_ID);
      expect(detailPage.saveAreasButton().isPresent()).toBe(true);

      detailPage.SaveAreas();
      browser.wait(until.elementToBeClickable(detailPage.AreaSelect()), constants.WAIT, 'Failed to find area');   
      expect(detailPage.AreaSelect().getText()).toBe(AREA_0_TITLE);
     });

  it('Updating area to a WI -desktop ', function() {
      var detailPage = page.clickWorkItem(page.firstWorkItem);
      browser.wait(until.elementToBeClickable(detailPage.areaLabel), constants.WAIT, 'Failed to find areaLabel');   
      detailPage.clickAreaSelect();
      detailPage.clickAreas(WORKITEM_0_ID);
      expect(detailPage.saveAreasButton().isPresent()).toBe(true);
      detailPage.SaveAreas();

      browser.wait(until.elementToBeClickable(detailPage.AreaSelect()), constants.WAIT, 'Failed to find area');   
      expect(detailPage.AreaSelect().getText()).toBe(AREA_0_TITLE);
      detailPage.clickAreaSelect();
      detailPage.clickAreas(WORKITEM_1_ID);
     
      detailPage.SaveAreas();
      browser.wait(until.elementToBeClickable(detailPage.AreaSelect()), constants.WAIT, 'Failed to find area');   
      expect(detailPage.AreaSelect().getText()).toBe(AREA_1_TITLE);
     });

    it('Try Removing area from a WI -desktop ', function() {
      var detailPage = page.clickWorkItem(page.firstWorkItem);
      browser.wait(until.elementToBeClickable(detailPage.areaLabel), constants.WAIT, 'Failed to find areaLabel');   
      detailPage.clickAreaSelect();
      detailPage.clickAreas(WORKITEM_0_ID);
      expect(detailPage.saveAreasButton().isPresent()).toBe(true);
      detailPage.SaveAreas();

      browser.wait(until.elementToBeClickable(detailPage.AreaSelect()), constants.WAIT, 'Failed to find area');   
      expect(detailPage.AreaSelect().getText()).toBe(AREA_0_TITLE);
      detailPage.clickAreaSelect();
      detailPage.ClosekAreas();
      expect(detailPage.AreaSelect().getText()).toBe(AREA_0_TITLE);
     });
});
