/**
 * POC test for automated UI tests for ALMighty
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
  WorkItemDetailPage = require('./page-objects/work-item-detail.page');

describe('Link item ', function () {
  var page, items, browserMode;

  beforeEach(function () {
    testSupport.setBrowserMode('desktop');
    page = new WorkItemListPage(true);  
    // detailPage = new WorkItemDetailPage();    
  });

 it('Create a link item planner to planner - Desktop', function () {
    var detailPage = page.clickWorkItemTitle(page.workItemByTitle("Title Text 3"), "id3");
    expect(detailPage.commentDiv().isPresent()).toBe(true);
    expect(detailPage.linkItemHeaderCaret().isPresent()).toBe(true);   
    detailPage.linkItemHeaderCaret().click();
    detailPage.clickCreateLinkButton(); 
    detailPage.clickLinkDropDown();
    detailPage.linkTypeDropDownListString("tests").click();
    /**Below commented code  works fine with the Chrome not with PhantomJS
     * Issue : https://github.com/fabric8io/fabric8-planner/issues/319
     */
    // detailPage.setSearchLinkItem("id0");
    // detailPage.clickOnLinkBind();
    // expect(detailPage.linkTitle()).toBe('Title Text 0');
    // expect(detailPage.linkState("0")).toBe('new');
    // expect(detailPage.linkclose("0").isPresent()).toBe(true);
    // expect(detailPage.linkTotalByTypes("0")).toBe("1");
   });
   it('Read a link item - Desktop', function () {
    var detailPage = page.clickWorkItemTitle(page.workItemByTitle("Title Text 0"), "id0");
    expect(detailPage.commentDiv().isPresent()).toBe(true);
    expect(detailPage.linkItemHeaderCaret().isPresent()).toBe(true);   
    detailPage.linkItemHeaderCaret().click();
     /**Below commented code  works fine with the Chrome not with PhantomJS
     * Issue : https://github.com/fabric8io/fabric8-planner/issues/319
     */
    // expect(detailPage.linkTitle()).toBe('Title Text 1');
    // expect(detailPage.linkItemTotalCount().getText()).toBe('1');
    // expect(detailPage.linkState("0")).toBe('new');
    // expect(detailPage.linkclose("0").isPresent()).toBe(true);
   });
   it('Delete link and check if it exists in list or not - Desktop', function () {
    var detailPage = page.clickWorkItemTitle(page.workItemByTitle("Title Text 0"), "id0");
    expect(detailPage.commentDiv().isPresent()).toBe(true);
    expect(detailPage.linkItemHeaderCaret().isPresent()).toBe(true);   
    detailPage.linkItemHeaderCaret().click();
     /**Below commented code  works fine with the Chrome not with PhantomJS
     * Issue : https://github.com/fabric8io/fabric8-planner/issues/319
     */
    // expect(detailPage.linkTitle()).toBe('Title Text 1');
    // expect(detailPage.linkState("0")).toBe('new');
    // expect(detailPage.linkclose("0").isPresent()).toBe(true);
    // detailPage.linkclose("0").click();
    // expect(detailPage.linkclose("0").isPresent()).toBe(false);
    // expect(detailPage.createLinkButton.isPresent()).toBe(true);
   });
   it('Update link child and check if it exists in list or not - Desktop', function () {
    // var detailPage = page.clickWorkItemTitle(page.workItemByTitle("Title Text 0"), "id0");
    // detailPage.clickWorkItemDetailTitleClick();
    // detailPage.setWorkItemDetailTitle("0", true);
    // detailPage.workItemDetailTitle.sendKeys(protractor.Key.ENTER);
    // detailPage.clickWorkItemDetailCloseButton();
    // /**Below commented code  works fine with the Chrome not with PhantomJS
    //  * Issue : https://github.com/fabric8io/fabric8-planner/issues/319
    //  */
    // // page.workItemByIndex("1").click();
    // // expect(detailPage.commentDiv().isPresent()).toBe(true);
    // // expect(detailPage.linkItemHeaderCaret().isPresent()).toBe(true);   
    // // detailPage.linkItemHeaderCaret().click();   
    // // expect(detailPage.linkTitle()).toBe('Title Text 00');
    // // expect(detailPage.linkState("0")).toBe('new');
    // // expect(detailPage.linkclose("0").isPresent()).toBe(true);
    // // detailPage.linkclose("0").click();
    // // expect(detailPage.linkclose("0").isPresent()).toBe(false);
    // // expect(detailPage.createLinkButton.isPresent()).toBe(true);
   });
   it('Check the elements of link item div are visible - Desktop', function () {
    var detailPage = page.clickWorkItemTitle(page.workItemByTitle("Title Text 0"), "id0");
    expect(detailPage.commentDiv().isPresent()).toBe(true);
    expect(detailPage.linkItemHeaderCaret().isPresent()).toBe(true);   
    detailPage.linkItemHeaderCaret().click();
    // expect(detailPage.linkItemTitle()).toBe("This item, Title Text 0");
    // expect(detailPage.checkLinkDropDown.isPresent()).toBe(true);
   });


});


