import { browser } from 'protractor';
import { PlannerPage } from '../page_objects/planner';
import * as support from '../support';


describe('Iteration test', () => {
  let planner: PlannerPage;

  beforeEach( async () => {
    await support.desktopTestSetup();
    planner = new PlannerPage(browser.baseUrl);
    await planner.openInBrowser();
    // This is necessary since the planner takes time to load on prod/prod-preview
    await browser.sleep(5000);
    await planner.ready();
  });

  it('should create a new iteration', async () => {
    let newIteration = 'new Iteration';
    let iteration3 = '/' + process.env.SPACE_NAME;
    await planner.sidePanel.createNewIteration();
    await planner.iteration.addNewIteration(newIteration, iteration3);
    let month = await planner.iteration.getMonth();
    let year = await planner.iteration.getYear();
    await planner.iteration.clickCreateIteration();
    expect(await planner.sidePanel.getIterationDate()).toContain('new Iteration [Active]'+month+' 1, '+year+' - '+month+' 28, '+year+'\n');
  });

  it('updating iteration should update workitem associated to iteration', async() => {
    let dropdownIteration1 = 'Iteration_5',
      updateIteration = 'Iteration 0123',
      workItemTitle1 = 'Workitem_Title_10';
    await planner.sidePanel.ready();
    await planner.workItemList.workItem(workItemTitle1).openQuickPreview();
    await planner.quickPreview.addIteration(dropdownIteration1);
    expect(await planner.workItemList.iterationText(workItemTitle1)).toBe(dropdownIteration1);
    await planner.sidePanel.selectIterationKebab(dropdownIteration1);
    await planner.sidePanel.openIterationDialogue();
    await planner.iteration.editIteration(updateIteration);
    await planner.quickPreview.notificationToast.untilCount(1);
    await planner.quickPreview.close();
    expect(await planner.workItemList.iterationText(workItemTitle1)).toBe(updateIteration);
  });

});
