/**
 * POC test for automated UI tests for Planner
 *  Story: Display and Update Work Item Details
 *  https://github.com/almighty/almighty-core/issues/298
 *
 * Note on screen resolutions - See: http://www.itunesextractor.com/iphone-ipad-resolution.html
 * Tests will be run on these resolutions:
 * - iPhone6s - 375x667
 * - iPad air - 768x1024
 * - Desktop -  1920x1080
 *
 * beforeEach will set the mode to desktop. Any tests requiring a different resolution will must set explicitly.
 *
 * @author naina-verma
 */

var WorkItemListPage = require('./page-objects/work-item-list.page'),
  testSupport = require('./testSupport'),
  constants = require('./constants');

describe('Link item ', function () {
  var page, items, browserMode;
  var until = protractor.ExpectedConditions;

  beforeEach(function () {
    testSupport.setBrowserMode('desktop');
    page = new WorkItemListPage(true);
    testSupport.setTestSpace(page);
  });

  it('Create a link item planner to planner - Desktop', function () {
    var detailPage = page.clickWorkItemTitle("Title Text 2");
    expect(detailPage.commentDiv().isPresent()).toBe(true);
    expect(detailPage.linkItemHeaderCaret().isPresent()).toBe(true);

    browser.wait(until.elementToBeClickable(detailPage.linkItemHeaderCaret()), constants.WAIT, 'Link icon is not clickable');
    detailPage.linkItemHeaderCaret().click();
    detailPage.clickCreateLinkButton();
    detailPage.clickLinkDropDown();
    detailPage.linkTypeDropDownListString("tests").click();

    detailPage.setSearchLinkItem("id0");
    detailPage.clickOnLinkBind();
    expect(detailPage.linkTitle()).toBe('Title Text 0');
    expect(detailPage.linkclose("0").isPresent()).toBe(true);
    expect(detailPage.linkTotalByTypes()).toBe("1");
   });

  it('Read a link item - Desktop', function () {
    var detailPage = page.clickWorkItemTitle("Title Text 0");
    expect(detailPage.commentDiv().isPresent()).toBe(true);
    expect(detailPage.linkItemHeaderCaret().isPresent()).toBe(true);

    browser.wait(until.elementToBeClickable(detailPage.linkItemHeaderCaret()), constants.WAIT, 'Link icon is not clickable');
    detailPage.linkItemHeaderCaret().click();
    expect(detailPage.linkTitle()).toBe('Title Text 1');
    expect(detailPage.linkItemTotalCount().getText()).toBe('1');
    expect(detailPage.linkclose("0").isPresent()).toBe(true);
   });

  it('Delete link and check if it exists in list or not - Desktop', function () {
    var detailPage = page.clickWorkItemTitle("Title Text 0");
    expect(detailPage.commentDiv().isPresent()).toBe(true);
    expect(detailPage.linkItemHeaderCaret().isPresent()).toBe(true);

    browser.wait(until.elementToBeClickable(detailPage.linkItemHeaderCaret()), constants.WAIT, 'Link icon is not clickable');
    detailPage.linkItemHeaderCaret().click();
    expect(detailPage.linkTitle()).toBe('Title Text 1');
    expect(detailPage.linkclose("0").isPresent()).toBe(true);
    detailPage.linkclose("0").click();
    expect(detailPage.linkclose("0").isPresent()).toBe(false);
    expect(detailPage.createLinkButton.isPresent()).toBe(true);
   });

  it('Update link child and check if it exists in list or not - Desktop', function () {
    var detailPage = page.clickWorkItemTitle("Title Text 0");
    detailPage.clickWorkItemDetailTitleClick();
    detailPage.setWorkItemDetailTitle("0", true); // Update title
    detailPage.clickWorkItemTitleSaveIcon();
    detailPage.clickWorkItemDetailCloseButton();
    var detailPage = page.clickWorkItemTitle("Title Text 1");
    expect(detailPage.commentDiv().isPresent()).toBe(true);
    expect(detailPage.linkItemHeaderCaret().isPresent()).toBe(true);
    detailPage.linkItemHeaderCaret().click();
    expect(detailPage.linkTitle()).toBe('Title Text 00'); // Verify new title
    expect(detailPage.linkclose("0").isPresent()).toBe(true);
    detailPage.linkclose("0").click();
    expect(detailPage.linkclose("0").isPresent()).toBe(false);
    expect(detailPage.createLinkButton.isPresent()).toBe(true);
   });

  it('Check the elements of link item div are visible - Desktop', function () {
    var detailPage = page.clickWorkItemTitle("Title Text 0");
    expect(detailPage.commentDiv().isPresent()).toBe(true);
    expect(detailPage.linkItemHeaderCaret().isPresent()).toBe(true);

    browser.wait(until.elementToBeClickable(detailPage.linkItemHeaderCaret()), constants.WAIT, 'Link icon is not clickable');
    detailPage.linkItemHeaderCaret().click();
    expect(detailPage.linkItemTitle()).toBe("This item, Title Text 0");
    expect(detailPage.checkLinkDropDown.isPresent()).toBe(true);
   });

});


