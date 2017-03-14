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
  WorkItemDetailPage = require('./page-objects/work-item-detail.page'),
describe('Area tests :: ', function () {
  var page, items, browserMode;

var until = protractor.ExpectedConditions;
var waitTime = 30000;

  beforeEach(function () {
    testSupport.setBrowserMode('desktop');
    page = new WorkItemListPage(true);
    detailPage = new WorkItemDetailPage(true);
  });
  it('Verify Area elements are present -desktop ', function() {
      page.clickWorkItemTitle(page.firstWorkItem, "id0");
      browser.wait(until.elementToBeClickable(detailPage.areaLabel()), constants.WAIT, 'Failed to find workItemStateDropDownButton');   
      expect(detailPage.areaLabel().getText()).toBe("Area");
      expect(detailPage.AreaSelect().isPresent()).toBe(true);
     });
  it('Adding area to a WI -desktop ', function() {
      page.clickWorkItemTitle(page.firstWorkItem, "id0");
      browser.wait(until.elementToBeClickable(detailPage.areaLabel()), constants.WAIT, 'Failed to find workItemStateDropDownButton');   
      detailPage.clickAreaSelect();
      detailPage.clickAreas('id0');
      expect(detailPage.saveAreasButton().isPresent()).toBe(true);
      detailPage.SaveAreas();
      browser.wait(until.elementToBeClickable(detailPage.AreaSelect()), constants.WAIT, 'Failed to find workItemStateDropDownButton');   
      expect(detailPage.AreaSelect().getText()).toBe('Area 0');
     });
  it('Updating area to a WI -desktop ', function() {
      page.clickWorkItemTitle(page.firstWorkItem, "id0");
      browser.wait(until.elementToBeClickable(detailPage.areaLabel()), constants.WAIT, 'Failed to find workItemStateDropDownButton');   
      detailPage.clickAreaSelect();
      detailPage.clickAreas('id0');
      expect(detailPage.saveAreasButton().isPresent()).toBe(true);
      detailPage.SaveAreas();
      browser.wait(until.elementToBeClickable(detailPage.AreaSelect()), constants.WAIT, 'Failed to find workItemStateDropDownButton');   
      expect(detailPage.AreaSelect().getText()).toBe('Area 0');
      detailPage.clickAreaSelect();
      detailPage.clickAreas('id1');
     
      detailPage.SaveAreas();
      browser.wait(until.elementToBeClickable(detailPage.AreaSelect()), constants.WAIT, 'Failed to find workItemStateDropDownButton');   
      expect(detailPage.AreaSelect().getText()).toBe('Area 1');
     });
    it('Try Removing area from a WI -desktop ', function() {
      page.clickWorkItemTitle(page.firstWorkItem, "id0");
      browser.wait(until.elementToBeClickable(detailPage.areaLabel()), constants.WAIT, 'Failed to find workItemStateDropDownButton');   
      detailPage.clickAreaSelect();
      detailPage.clickAreas('id0');
      expect(detailPage.saveAreasButton().isPresent()).toBe(true);
      detailPage.SaveAreas();
      browser.wait(until.elementToBeClickable(detailPage.AreaSelect()), constants.WAIT, 'Failed to find workItemStateDropDownButton');   
      expect(detailPage.AreaSelect().getText()).toBe('Area 0');
      detailPage.clickAreaSelect();
      detailPage.ClosekAreas();
      expect(detailPage.AreaSelect().getText()).toBe('Area 0');
     });
});
