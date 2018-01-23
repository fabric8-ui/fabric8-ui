import { browser } from 'protractor';
import { PlannerPage } from '../page_objects/planner'
import * as support from '../support';


describe('Planner Tab', () => {
  let planner: PlannerPage;
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
  });

  it('can create a work item', async () => {
    await planner.createWorkItem({
      title: 'Workitem Title',
      description: 'Describes the work item'
    });

    expect(await planner.workItemList.hasWorkItem('Workitem Title')).toBeTruthy();
    await planner.workItemList.clickWorkItem('Workitem Title');
    await planner.quickPreview.addAssignee('Example User 1');
    expect(await planner.quickPreview.hasAssignee('Example User 1')).toBeTruthy();

    await planner.quickPreview.close();

    await planner.workItemList.clickWorkItem('Workitem Title');
    await planner.quickPreview.addAssignee('Example User 1');
    expect(await planner.quickPreview.hasAssignee('Example User 1')).toBeFalsy();

    await planner.quickPreview.close();
    expect(await planner.workItemList.hasWorkItem('Workitem Title123')).toBeFalsy();
  });

});

