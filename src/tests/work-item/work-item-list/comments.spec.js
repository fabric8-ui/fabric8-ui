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
describe('Comments tests :: ', function () {
  var page, items, browserMode;

var until = protractor.ExpectedConditions;
var waitTime = 30000;

  beforeEach(function () {
    testSupport.setBrowserMode('desktop');
    page = new WorkItemListPage(true);
    detailPage = new WorkItemDetailPage(true);
    testSupport.setTestSpace(page);
  });
  it('Verify comments text area, username, comment,time is present -desktop ', function() {
      page.clickWorkItemTitle(page.firstWorkItem, "id0");
      expect(detailPage.commentDiv().isPresent()).toBe(true);
      detailPage.clickCommentsDiv();
      detailPage.writeComment("some comment");
      expect(detailPage.commentsAvatar('0').isPresent()).toBe(true);
     });

  it('Edit comment and remove previous value and save -desktop ', function() {
      page.clickWorkItemTitle(page.firstWorkItem, "id0");
      detailPage.commentBody("0").click();
      detailPage.editComments("updated comment !",'0',false);
      detailPage.clickSaveComment("0");
      expect(detailPage.getCommentBody("0")).toBe('updated comment !');
     });
  it('Edit comment with previous value and save -desktop ', function() {
      page.clickWorkItemTitle(page.firstWorkItem, "id0");
      detailPage.commentBody("0").click();
      detailPage.editComments(" updated comment !",'0',true);
      detailPage.clickSaveComment("0");
      expect(detailPage.getCommentBody("0")).toBe('Some Comment 0 updated comment !');
     });
  it('Edit comment and cancel -desktop ', function() {
      page.clickWorkItemTitle(page.firstWorkItem, "id0");
      detailPage.commentBody("0").click();
      detailPage.editComments("updated comment !",'0',false);
      detailPage.clickCloseComment("0");
      expect(detailPage.getCommentBody("0")).toBe('Some Comment 0');
     });
  it('Get total number of comments -desktop ', function() {
      page.clickWorkItemTitle(page.firstWorkItem, "id0");
      detailPage.writeComment("some comment1");
      detailPage.writeComment("some comment1");
      expect(detailPage.getTotalNumberOfComments()).toBe('3');
     });
  it('CRUD Comment -desktop ', function() {
      page.clickWorkItemTitle(page.workItemByTitle("Title Text 3"), "id3");
      detailPage.writeComment("some comment");
      expect(detailPage.commentsAvatar('0').isPresent()).toBe(true);
      browser.wait(until.elementToBeClickable(detailPage.commentsKebab()), constants.WAIT, 'Failed to find element');   
      detailPage.clickCommentsKebab();
      expect(detailPage.commentsKebab().isPresent()).toBe(true);
      detailPage.clickEditComment();
      detailPage.editComments("updated comment !",'0',false);
      detailPage.clickCloseComment("0");
      expect(detailPage.getCommentBody("0")).toBe('some comment');
      //Delete 
      detailPage.clickCommentsKebab();
      expect(detailPage.commentsKebab().isPresent()).toBe(true);
      detailPage.clickDeleteComment();
      expect(detailPage.deleteCommentDialogeCancel().isPresent()).toBe(true);
      expect(detailPage.deleteCommentDialogeDeletebtn().isPresent()).toBe(true);
      expect(detailPage.getDeleteCommentDialogeModalTitle()).toBe("Delete Comment");
     });
});
