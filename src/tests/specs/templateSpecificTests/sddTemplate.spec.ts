import { browser } from 'protractor';
import { PlannerPage } from '../../page_objects/planner';
import * as support from '../../support';


describe('SDD template tests: ', () => {
  let plannerSDD: PlannerPage;
  let c = new support.Constants();
  let testData;

  beforeAll(async () => {
    await support.desktopTestSetup();
    plannerSDD = new PlannerPage(browser.baseUrl);
    await plannerSDD.openInBrowser();
    await plannerSDD.waitUntilUrlContains('typegroup');
    testData = await c.browserName[browser.browserName];
  });

  beforeEach(async () => {
    await plannerSDD.ready();
    await plannerSDD.workItemList.overlay.untilHidden();
  });

  it('Scenario-Quick Add should support Scenario, papercuts and fundamentals' , async () => {
    let wiTypes = await plannerSDD.quickAdd.workItemTypes();
      expect(wiTypes.length).toBe(3);
      expect(wiTypes[0]).toBe('Scenario');
      expect(wiTypes[1]).toBe('Fundamental');
      expect(wiTypes[2]).toBe('Papercuts');
  });

  it('Experiences-Quick Add should support Experience and Value proposition', async () => {
    await plannerSDD.sidePanel.clickWorkItemGroup('Experiences');
    let wiTypes = await plannerSDD.quickAdd.workItemTypes();
    expect(wiTypes.length).toBe(2);
    expect(wiTypes[0]).toBe('Experience');
    expect(wiTypes[1]).toBe('Value Proposition');
  });

  it('Requirement-Quick Add should support Feature and Bug', async () => {
    await plannerSDD.sidePanel.clickWorkItemGroup('Requirements');
    let wiTypes = await plannerSDD.quickAdd.workItemTypes();
    expect(wiTypes.length).toBe(2);
    expect(wiTypes[0]).toBe('Feature');
    expect(wiTypes[1]).toBe('Bug');
  });

  it('Infotip opens on clicking on infotip icon and closes on outside click', async () => {
    await plannerSDD.sidePanel.infotipIconExperience.clickWhenReady();
    await plannerSDD.sidePanel.infotipIconRequirement.clickWhenReady();
    expect(await plannerSDD.sidePanel.infotipPopover.count()).toBe(1);
  });

  it('matching child should be expanded initially', async () => {
    let workitemname = {'title': 'child', 'type': 'Bug'},
      workItemTitle4 = {'title': 'Workitem_Title_4'};

    await plannerSDD.sidePanel.clickWorkItemGroup('Requirements');
    await plannerSDD.workItemList.workItem(workItemTitle4.title).clickInlineQuickAdd();
    await plannerSDD.createInlineWorkItem(workitemname);
    expect(await plannerSDD.workItemList.hasWorkItem(workitemname.title)).toBeTruthy();
    await plannerSDD.sidePanel.clickWorkItemGroup('Scenarios');
    await plannerSDD.waitUntilUrlContains('typegroup.name:Scenarios');
    await plannerSDD.sidePanel.clickWorkItemGroup('Requirements');
    await plannerSDD.waitUntilUrlContains('typegroup.name:Requirements');
    await plannerSDD.workItemList.overlay.untilHidden();
    expect(await plannerSDD.workItemList.hasWorkItem(workitemname.title)).toBeTruthy();
  });
});
