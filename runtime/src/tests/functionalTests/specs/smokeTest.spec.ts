import { browser } from 'protractor';
import { PlannerPage } from '../page_objects/planner'
import * as support from '../support';


describe('Planner Smoke Tests', () => {
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

  it('can create a work item and add/remove assignee', async () => {
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

  it('can update workitem title/description', async () => {
    await planner.createWorkItem({
      title: 'Workitem Title 1',
      description: 'Describes the work item'
    });

    expect(await planner.workItemList.hasWorkItem('Workitem Title 1')).toBeTruthy();
    await planner.workItemList.clickWorkItem('Workitem Title 1');
    await planner.quickPreview.updateTitle('New Workitem Title');
    await planner.quickPreview.updateDescription('New WorkItem Description');
    // Mock data doesn't support saving description
    // expect(await planner.quickPreview.hasDescription('New WorkItem Description')).toBeTruthy();
    await planner.quickPreview.close();
    expect(await planner.workItemList.hasWorkItem('Workitem Title 1')).toBeFalsy();
    expect(await planner.workItemList.hasWorkItem('New Workitem Title')).toBeTruthy();
  });
});

