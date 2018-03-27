import { browser } from 'protractor';
import { PlannerPage } from '../page_objects/planner';
import * as support from '../support';


describe('planner quick preview tests', () => {
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

  // TODO: Work item link will be added shortly
  // This test has to be activated
  xit('should link a workitem',async () => {
    await planner.workItemList.clickWorkItem(c.workItemTitle3);
    await planner.quickPreview.addLink(c.linkType, c.workItemTitle4);
    expect(await planner.quickPreview.hasLinkedItem(c.workItemTitle4)).toBeTruthy();
  });

  it('description box should not be open for wis',async () => {
    await planner.workItemList.clickWorkItem(c.workItemTitle1);
    await planner.quickPreview.openDescriptionBox();
    expect(await planner.quickPreview.isSaveButtonDisplayed()).toBeTruthy();
  
    // Open another WI(Note: the description box is still in edit mode)
    await planner.workItemList.clickWorkItem(c.workItemTitle2);
    // The description box should not be in edit mode 
    expect(await planner.quickPreview.isSaveButtonDisplayed()).toBeFalsy();
  })
});
