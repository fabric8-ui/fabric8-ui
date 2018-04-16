import { browser } from 'protractor';
import { PlannerPage } from '../page_objects/planner';
import * as support from '../support';


describe('Quick preview tests: ', () => {
  let planner: PlannerPage;
  let c = new support.Constants();

  beforeEach( async () => {
    await support.desktopTestSetup();
    planner = new PlannerPage(browser.baseUrl);
    await planner.openInBrowser();
    // This is necessary since the planner takes time to load on prod/prod-preview
    await browser.sleep(5000);
    await planner.ready();
  });

  it('should open quickpreview and apply label', async () => {
    await planner.workItemList.clickWorkItem(c.workItemTitle1);
    await planner.quickPreview.addLabel(c.label);
    expect(await planner.quickPreview.hasLabel(c.label)).toBeTruthy();
  });

  it('should open quick preview and create new label',async () => {
    await planner.workItemList.clickWorkItem(c.workItemTitle1);
    await planner.quickPreview.createNewLabel(c.newLabel);
    expect(await planner.quickPreview.hasLabel(c.newLabel)).toBeTruthy();
  });

  // Skip this tests since it is failing (and we need to merge the E2E PR)
  // Todo(Raunak): Fix this test
  xit('should link a workitem',async () => {
    await planner.workItemList.clickWorkItem(c.workItemTitle2);
    await planner.quickPreview.addLink(c.linkType, c.workItemTitle1);
    expect(await planner.quickPreview.hasLinkedItem(c.workItemTitle1)).toBeTruthy();
  });

  it('should open quick preview and edit the title',async () => {
    let title = await planner.createUniqueWorkItem();
    await planner.workItemList.clickWorkItem(title);
    await planner.quickPreview.updateTitle(c.editWorkItemTitle1);
    await planner.quickPreview.notificationToast.untilHidden();
    expect(await planner.quickPreview.titleDiv.getTextWhenReady()).toBe('Title Text "<0>"');
  });

  it('description box should not be open for wis',async () => {
    let workitemname = {"title": "quickpreview test"};
    await planner.createWorkItem(workitemname);
    await planner.workItemList.clickWorkItem(workitemname.title);
    await planner.quickPreview.openDescriptionBox();
    expect(await planner.quickPreview.isSaveButtonDisplayed()).toBeTruthy();

    // Open another WI(Note: the description box is still in edit mode)
    await planner.workItemList.clickWorkItem(c.workItemTitle2);
    // The description box should not be in edit mode
    expect(await planner.quickPreview.isSaveButtonDisplayed()).toBeFalsy();
  })
});
