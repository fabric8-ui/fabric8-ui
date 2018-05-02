import { browser } from 'protractor';
import { PlannerPage } from '../page_objects/planner';
import * as support from '../support';


describe('Quick preview tests: ', () => {
  let planner: PlannerPage;
  let c = new support.Constants();

  beforeEach( async () => {
    await support.desktopTestSetup();
    planner = new PlannerPage(browser.baseUrl);
    await planner.openInBrowser();
    // This is necessary since the planner takes time to load on prod/prod-preview
    await browser.sleep(5000);
    await planner.ready();
  });

  it('should open quickpreview and apply label', async () => {
    await planner.workItemList.clickWorkItem(c.workItemTitle1);
    await planner.quickPreview.addLabel(c.label);
    expect(await planner.quickPreview.getLabels()).toContain(c.label);
  });

  it('should open quick preview and create new label',async () => {
    await planner.workItemList.clickWorkItem(c.workItemTitle1);
    await planner.quickPreview.createNewLabel(c.newLabel);
    expect(await planner.quickPreview.getLabels()).toContain(c.newLabel);
  });

  it('should link a workitem',async () => {
    let workitemname = {"title": "link test"},
      linkType = 'blocks',
      workItemTitle17 = 'Workitem_Title_17';
    await planner.createWorkItem(workitemname);    
    await planner.workItemList.clickWorkItem(workitemname.title);
    await planner.quickPreview.addLink(linkType, workItemTitle17);
    expect(await planner.quickPreview.getLinkedItems()).toContain(workItemTitle17);
  });

  it('should open quick preview and edit the title',async () => {
    let title = await planner.createUniqueWorkItem();
    await planner.workItemList.clickWorkItem(title);
    await planner.quickPreview.updateTitle(c.editWorkItemTitle1);
    await planner.quickPreview.notificationToast.untilHidden();
    expect(await planner.quickPreview.titleDiv.getTextWhenReady()).toBe('Title Text "<0>"');
  });

  it('description box should not be open for wis',async () => {
    let workitemname = {"title": "quickpreview test"};
    await planner.createWorkItem(workitemname);
    await planner.workItemList.clickWorkItem(workitemname.title);
    await planner.quickPreview.openDescriptionBox();
    expect(await planner.quickPreview.isSaveButtonDisplayed()).toBeTruthy();

    // Open another WI(Note: the description box is still in edit mode)
    await planner.workItemList.clickWorkItem(c.workItemTitle2);
    // The description box should not be in edit mode
    expect(await planner.quickPreview.isSaveButtonDisplayed()).toBeFalsy();
  })

  it('should close assignee dropdown when clicked outside',async () => {
    await planner.workItemList.clickWorkItem(c.workItemTitle1);
    await planner.quickPreview.assigneeDropdown.clickWhenReady();
    expect(await planner.quickPreview.assigneeDropdownMenu.getAttribute('className')).toContain('show');
    await planner.quickPreview.titleInput.clickWhenReady();
    expect(await planner.quickPreview.assigneeDropdownMenu.getAttribute('className')).not.toContain('show');
  })
});
