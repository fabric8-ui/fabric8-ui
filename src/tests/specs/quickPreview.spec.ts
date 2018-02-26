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

  it('should link a workitem',async () => {
    await planner.workItemList.clickWorkItem(c.workItemTitle3);
    await planner.quickPreview.addLink(c.linkType, c.workItemTitle4);
    expect(await planner.quickPreview.hasLinkedItem(c.workItemTitle4)).toBeTruthy();
  });
});
