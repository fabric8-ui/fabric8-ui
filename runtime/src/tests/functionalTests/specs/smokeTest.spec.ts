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
    await planner.createWorkItem(c.newWorkItem1);
    expect(await planner.workItemList.hasWorkItem(c.newWorkItem1.title)).toBeTruthy();
    await planner.workItemList.clickWorkItem(c.newWorkItem1.title);

    await planner.quickPreview.addAssignee(c.user2);
    expect(await planner.quickPreview.hasAssignee(c.user2)).toBeTruthy();
    expect(await planner.quickPreview.hasCreationTime('Creating now!')).toBeTruthy();
    await planner.quickPreview.close();

    await planner.workItemList.clickWorkItem(c.newWorkItem1.title);
    await planner.quickPreview.addAssignee(c.user2);
    expect(await planner.quickPreview.hasAssignee(c.user2)).toBeFalsy();
    await planner.quickPreview.close();
  });

  it('update workitem title/description', async () => {
    await planner.createWorkItem(c.newWorkItem2);

    expect(await planner.workItemList.hasWorkItem(c.newWorkItem2.title)).toBeTruthy();
    await planner.workItemList.clickWorkItem(c.newWorkItem2.title);
    await planner.quickPreview.updateTitle(c.updatedWorkItem.title);
    await planner.quickPreview.updateDescription(c.updatedWorkItem.description);
    expect(await planner.quickPreview.hasDescription(c.updatedWorkItem.description)).toBeTruthy();
    await planner.quickPreview.close();
    expect(await planner.workItemList.hasWorkItem(c.newWorkItem2.title)).toBeFalsy();
    expect(await planner.workItemList.hasWorkItem(c.updatedWorkItem.title)).toBeTruthy();
  });

  it('Check WorkItem creator name and image is reflected', async () => {
    await planner.workItemList.clickWorkItem(c.workItemTitle1);
    expect(await planner.quickPreview.hasCreator(c.user1)).toBeTruthy();
    expect(await planner.quickPreview.hasCreatorAvatar(c.user_avatar)).toBeTruthy()
    await planner.quickPreview.close();
  });

  it('Associate workitem with an Area', async () => {
    await planner.workItemList.clickWorkItem(c.workItemTitle2);
    await planner.quickPreview.addArea(c.areaTitle1);
    expect(await planner.quickPreview.hasArea(c.areaTitle1)).toBeTruthy();
    await planner.quickPreview.close();

    await planner.workItemList.clickWorkItem(c.workItemTitle2);
    expect(await planner.quickPreview.hasArea(c.areaTitle1)).toBeTruthy();
    await planner.quickPreview.addArea(c.areaTitle2);
    expect(await planner.quickPreview.hasArea(c.areaTitle1)).toBeFalsy();
    expect(await planner.quickPreview.hasArea(c.areaTitle2)).toBeTruthy();
    await planner.quickPreview.close();
  });

  it('Associate/Re-associate workitem with an Iteration', async () => {
    await planner.workItemList.clickWorkItem(c.workItemTitle3);
    await planner.quickPreview.addIteration(c.iteration1);
    expect(await planner.quickPreview.hasIteration(c.iteration1)).toBeTruthy();
    await planner.quickPreview.close();

    await planner.workItemList.clickWorkItem(c.workItemTitle3);
    expect(await planner.quickPreview.hasIteration(c.iteration1)).toBeTruthy();
    await planner.quickPreview.addIteration(c.iteration2);
    expect(await planner.quickPreview.hasIteration(c.iteration2)).toBeTruthy();
    await planner.quickPreview.close();

    await planner.workItemList.clickWorkItem(c.workItemTitle3);
    expect(await planner.quickPreview.hasIteration(c.iteration2)).toBeTruthy();
    await planner.quickPreview.close();
  });

  it('Scenario-Quick Add should support Scenario, papercuts and fundamentals' ,async () => {
    await planner.sidePanel.clickScenarios();
    let wiTypes = await planner.quickAdd.workItemTypes();
    expect(wiTypes.length).toBe(3);
    expect(wiTypes).toContain('Scenario');
    expect(wiTypes).toContain('Papercuts');
    expect(wiTypes).toContain('Fundamental');
  });

  it('Experiences-Quick Add should support Experience and Value proposition', async () => {
    await planner.sidePanel.clickExperience();
    let wiTypes = await planner.quickAdd.workItemTypes();
    expect(wiTypes.length).toBe(2);
    expect(wiTypes).toContain('Experience');
    expect(wiTypes).toContain('Value Proposition');
  });
});

