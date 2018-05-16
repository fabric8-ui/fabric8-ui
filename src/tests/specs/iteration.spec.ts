import { browser } from 'protractor';
import { PlannerPage } from '../page_objects/planner';
import * as support from '../support';


describe('Iteration test', () => {
  let planner: PlannerPage;

  beforeAll( async () => {
    await support.desktopTestSetup();
    planner = new PlannerPage(browser.baseUrl);
    await planner.openInBrowser();
    await planner.waitUntilUrlContains('typegroup');
    await planner.ready();
  });

  beforeEach( async () => {
    await planner.resetState();
  });

  it('should create a new iteration', async () => {
    let newIteration = 'new Iteration';
    let iteration3 = '/' + process.env.SPACE_NAME;
    await planner.sidePanel.createNewIteration();
    await planner.iteration.addNewIteration(newIteration, null, true);
    let month = await planner.iteration.getMonth();
    let year = await planner.iteration.getYear();
    let lastDayOfMonth = await planner.iteration.getLastDayOfMonth();
    await planner.iteration.clickCreateIteration();
    expect(await planner.sidePanel.getIterationDate()).toContain('new Iteration [Active]'+month+' 1, '+year+' - '+month+' '+ lastDayOfMonth, +year+'\n');
  });

  it('should create a new child iteration', async () => {
    let newIteration = 'new Iteration1';
    let parentIteration = '/' + process.env.SPACE_NAME + '/Iteration_3';
    let iteration = 'Iteration_3';
    await planner.sidePanel.createNewIteration();
    await planner.iteration.addNewIteration(newIteration, parentIteration);
    await planner.iteration.clickCreateIteration();
    await planner.sidePanel.clickExpander(iteration);
    expect(await planner.sidePanel.getIterationList()).toContain(newIteration);
  });

  it('updating iteration should update workitem associated to iteration', async() => {
    let dropdownIteration1 = 'Iteration_5',
      updateIteration = 'Iteration 0123',
      workItemTitle1 = 'Workitem_Title_10';

    await planner.sidePanel.ready();
    await planner.workItemList.workItem(workItemTitle1).openQuickPreview();
    await planner.quickPreview.addIteration(dropdownIteration1);
    await planner.quickPreview.close();
    expect(await planner.workItemList.iterationText(workItemTitle1)).toBe(dropdownIteration1);
    await planner.sidePanel.selectIterationKebab(dropdownIteration1);
    await planner.sidePanel.openIterationDialogue();
    await planner.iteration.editIteration(updateIteration);
    await planner.quickPreview.notificationToast.untilCount(1);
    expect(await planner.workItemList.iterationText(workItemTitle1)).toBe(updateIteration);
  });

  // Regression test for https://github.com/openshiftio/openshift.io/issues/3318
  it('Iteration modal should have sane values', async() => {
    let iterationName = "issue-3318";
    // Create iteration "issue-3318"
    await planner.sidePanel.createNewIteration();
    await planner.iteration.addNewIteration(iterationName);
    await planner.iteration.clickCreateIteration();
    await browser.sleep(1000);
    // Ensure dropdown list has only 1 "issue-3318"
    await planner.sidePanel.createNewIteration();
    await planner.iteration.parentIteration.enterText(iterationName);
    let val = await planner.iteration.parentDropdownList.getTextWhenReady();
    // Ensure val is exactly the value we expect it to be
    expect(val).toBe('/' + process.env.SPACE_NAME + '/' + iterationName)
  });
})
