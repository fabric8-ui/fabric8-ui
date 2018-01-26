import { browser } from 'protractor';
import { PlannerPage } from '../page_objects/planner';
import { Constants } from '../support/constants';
import * as support from '../support';


describe('Planner Smoke Tests:', () => {
  let planner: PlannerPage;
  let c = new Constants();

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

  it('create a work item and add/remove assignee', async () => {
    await planner.createWorkItem(c.newWorkItem);
    expect(await planner.workItemList.hasWorkItem(c.newWorkItem.title)).toBeTruthy();
    await planner.workItemList.clickWorkItem(c.newWorkItem.title);

    await planner.quickPreview.addAssignee(c.user1);
    expect(await planner.quickPreview.hasAssignee(c.user1)).toBeTruthy();
    expect(await planner.quickPreview.hasCreationTime('Creating now!')).toBeTruthy();
    await planner.quickPreview.close();

    await planner.workItemList.clickWorkItem(c.newWorkItem.title);
    await planner.quickPreview.addAssignee(c.user1);
    expect(await planner.quickPreview.hasAssignee(c.user1)).toBeFalsy();
    await planner.quickPreview.close();
  });

  it('update workitem title/description', async () => {
    await planner.createWorkItem(c.newWorkItem1);

    expect(await planner.workItemList.hasWorkItem(c.newWorkItem1.title)).toBeTruthy();
    await planner.workItemList.clickWorkItem(c.newWorkItem1.title);
    await planner.quickPreview.updateTitle(c.updatedWorkItem.title);
    await planner.quickPreview.updateDescription(c.updatedWorkItem.description);
    // Mock data doesn't support saving description
    // expect(await planner.quickPreview.hasDescription(c.updatedWorkItem.description)).toBeTruthy();
    await planner.quickPreview.close();
    expect(await planner.workItemList.hasWorkItem(c.newWorkItem1.title)).toBeFalsy();
    expect(await planner.workItemList.hasWorkItem(c.updatedWorkItem.title)).toBeTruthy();
  });

  it('Edit and check WorkItem, creator name and image is reflected', async () => {
    await planner.workItemList.clickWorkItem(c.workItemTitle1);
    expect(await planner.quickPreview.hasCreator(c.user)).toBeTruthy();

    await planner.quickPreview.updateTitle(c.updatedWorkItem.title);
    expect(await planner.quickPreview.hasCreator(c.user)).toBeTruthy();
    expect(await planner.quickPreview.hasCreatorAvatar(c.user_avatar)).toBeTruthy()
    await planner.quickPreview.close();

    expect(await planner.workItemList.hasWorkItem(c.workItemTitle1)).toBeFalsy();
    expect(await planner.workItemList.hasWorkItem(c.updatedWorkItem.title)).toBeTruthy();

    await planner.workItemList.clickWorkItem(c.updatedWorkItem.title);
    expect(await planner.quickPreview.hasCreator(c.user)).toBeTruthy();
    expect(await planner.quickPreview.hasCreatorAvatar(c.user_avatar)).toBeTruthy()
  });
});

