import { browser } from 'protractor';
import { PlannerPage } from '../page_objects/planner';
import * as support from '../support';


describe('Detail View test: ', () => {
  let planner: PlannerPage;
  let c = new support.Constants();

  beforeAll(async () => {
    await support.desktopTestSetup();
    planner = new PlannerPage(browser.baseUrl);
    await planner.openInBrowser();
    await planner.waitUntilUrlContains('typegroup');
    await planner.ready();
  });

  beforeEach(async () => {
    await planner.waitUntilUrlContains('typegroup');
    await planner.ready();
    await planner.workItemList.overlay.untilHidden();
  });

  afterEach(async () => {
    await planner.quickPreview.close();
  });

  it('should open detail view and apply label', async () => {
    let workitemname = {'title': 'detail page test'};
    await planner.createWorkItem(workitemname);
    await planner.workItemList.openDetailPage(workitemname.title);
    await planner.waitUntilUrlContains('detail');
    await planner.detailPage.titleInput.untilTextIsPresentInValue(workitemname.title);
    await planner.detailPage.addLabel(c.label);
    expect(await planner.detailPage.getLabels()).toContain(c.label);
  });

  it('should update title and description', async () => {
    let workitemname = {'title': 'detail page title test'},
     updatedWorkItem = {
      title: 'detail page title updated',
      description: 'New WorkItem Description'
    };
    await planner.createWorkItem(workitemname);
    await planner.workItemList.openDetailPage(workitemname.title);
    await planner.waitUntilUrlContains('detail');
    await planner.detailPage.titleInput.untilTextIsPresentInValue(workitemname.title);
    await planner.detailPage.updateTitle(updatedWorkItem.title);
    await planner.detailPage.updateDescription(updatedWorkItem.description);
    expect(await planner.detailPage.titleInput.getAttribute('value')).toBe(updatedWorkItem.title);
    expect(await planner.detailPage.getDescription()).toBe(updatedWorkItem.description);
  });

  it('should associate workitem with an Area', async () => {
    await planner.workItemList.openDetailPage(c.workItemTitle2);
    await planner.waitUntilUrlContains('detail');
    await planner.detailPage.titleInput.untilTextIsPresentInValue(c.workItemTitle2);
    await planner.detailPage.addArea(c.dropdownareaTitle1);
    expect(await planner.detailPage.getArea()).toBe(c.areaTitle1);
  });

  it('should associate workitem with an Iteration', async () => {
    await planner.workItemList.openDetailPage(c.workItemTitle2);
    await planner.waitUntilUrlContains('detail');
    await planner.detailPage.titleInput.untilTextIsPresentInValue(c.workItemTitle2);
    await planner.detailPage.addIteration(c.dropdownIteration1);
    expect(await planner.detailPage.getIteration()).toBe(c.iteration1);
  });

  it('should add comment', async () => {
    await planner.workItemList.openDetailPage(c.workItemTitle2);
    await planner.waitUntilUrlContains('detail');
    await planner.detailPage.titleInput.untilTextIsPresentInValue(c.workItemTitle2);
    await planner.detailPage.addCommentAndSave(c.comment);
    expect(await planner.detailPage.getComments()).toContain(c.comment);
  });

  it('should link a workitem', async () => {
    let linkType = 'blocks',
      searchWorkItem = '2 - Workitem_Title_3',
      Workitem_Title_3 = 'Workitem_Title_3';
    await planner.workItemList.openDetailPage(c.workItemTitle2);
    await planner.waitUntilUrlContains('detail');
    await planner.detailPage.titleInput.untilTextIsPresentInValue(c.workItemTitle2);
    await planner.detailPage.addLink(linkType, searchWorkItem, Workitem_Title_3);
    expect(await planner.detailPage.getLinkedItems()).toContain(Workitem_Title_3);
  });

  it('should remove link from workitem', async () => {
    let workItemName1 = {'title': 'Remove_link_from_workitem_test'},
      linkType = 'blocks',
      searchWorkItem = '3 - Workitem_Title_4',
      Workitem_Title = 'Workitem_Title_4';
    await planner.createWorkItem(workItemName1);
    await planner.workItemList.openDetailPage(workItemName1.title);
    await planner.waitUntilUrlContains('detail');
    await planner.detailPage.titleInput.untilTextIsPresentInValue(workItemName1.title);
    await planner.detailPage.addLink(linkType, searchWorkItem, Workitem_Title);
    expect(await planner.detailPage.getLinkedItems()).toContain(Workitem_Title);
    await planner.detailPage.removeLink(Workitem_Title);
    await planner.detailPage.linkCount.untilTextIsPresent('0');
    expect(await planner.detailPage.linkCount.getTextWhenReady()).toBe('0');
  });

  it('should change the state of workitem', async () => {
    await planner.workItemList.openDetailPage(c.workItemTitle2);
    await planner.waitUntilUrlContains('detail');
    await planner.detailPage.titleInput.untilTextIsPresentInValue(c.workItemTitle2);
    await planner.detailPage.changeStateTo('open');
    expect(await planner.detailPage.getState()).toBe('open');
  });

  it('Should change the type of work item', async () => {
    let workitemname = {'title': 'change type test'};
    await planner.createWorkItem(workitemname);
    await planner.workItemList.openDetailPage(workitemname.title);
    await planner.waitUntilUrlContains('detail');
    await planner.detailPage.titleInput.untilTextIsPresentInValue(workitemname.title);
    await planner.detailPage.changeTypeTo('Bug');
    expect(await planner.detailPage.getType()).toBe('Bug');
  });
});
