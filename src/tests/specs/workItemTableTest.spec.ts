import { browser } from 'protractor';
import { PlannerPage } from '../page_objects/planner';
import * as support from '../support';


describe('Work Item datatable list', () => {
  let planner: PlannerPage;
  let c = new support.Constants();

  beforeEach( async () => {
    await support.desktopTestSetup();
    let token = encodeURIComponent(JSON.stringify({
      access_token: "somerandomtoken",
      expires_in: 1800,
      refresh_token: "somerandomtoken",
      token_type: "bearer"
    }));
    let planner_url = browser.baseUrl + "/?token_json=" + token;
    planner = new PlannerPage(planner_url);
    await planner.openInBrowser();
  });

  it('should open settings button and hide columns', async () => {
    expect(await planner.workItemList.getDataTableHeaderCellCount()).toBe(10);
    await planner.settings.clickSettings();
    await planner.settings.selectAttribute(c.attribute1);
    await planner.settings.moveToAvailableAttribute();
    expect(await planner.workItemList.getDataTableHeaderCellCount()).toBe(9);
  });

  it('quick add should be disable for flat view', async() => {
    await planner.header.clickShowTree();
    await browser.sleep(2000);
    await planner.workItemList.overlay.untilHidden();
    expect(await planner.workItemList.getInlineQuickAddClass(c.workItemTitle1)).toContain('disable');
  });

  it('hideTree and create a work item then work item should be displayed when show tree is selected', async () => {
    await planner.header.clickShowTree();
    await planner.createWorkItem(c.newWorkItem1);
    expect(await planner.workItemList.hasWorkItem(c.newWorkItem1.title)).toBeTruthy();
    await planner.header.clickShowTree();
    expect(await planner.workItemList.hasWorkItem(c.newWorkItem1.title)).toBeTruthy();
  });

  it('work item should show updated title when switching from flat to tree view', async() => {
    await planner.header.clickShowTree();
    await planner.workItemList.clickWorkItem(c.workItemTitle1);
    await planner.quickPreview.updateTitle(c.updatedWorkItem.title);
    expect(await planner.workItemList.hasWorkItem(c.updatedWorkItem.title)).toBeTruthy();
    await planner.quickPreview.close();
    await planner.header.clickShowTree();
    expect(await planner.workItemList.hasWorkItem(c.updatedWorkItem.title)).toBeTruthy();
  });
});
