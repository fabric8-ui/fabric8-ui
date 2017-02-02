/**
 * Support module for automated UI tests for ALMighty
 * 
 * Ref: https://www.sitepoint.com/understanding-module-exports-exports-node-js/
 * 
 * @author ldimaggi
 */

let constants = require("./constants");
let testSupport = require("./testSupport");
var until = protractor.ExpectedConditions;

module.exports = {

    /**
     * Function to create (quick add) a new workitem
     * 
     * @param
     * page - workitem page
     * workItemTitle - Title string for the new workitem
     * workItemDesc - Description string for the new workitem, (desktop model only) (optional)
     * 
     */
    quickCreateWorkItem: function(page, titleText, descriptionText) {  

        /* Click the add button */
        page.clickWorkItemQuickAdd();

        /* Enter the workitem title */
        page.typeQuickAddWorkItemTitle(titleText);

        /* The description field is not displayed on phones - If the UI element is present, enter the description */
        page.workItemQuickAddDesc.isDisplayed().then(function(visible) {
            if (visible) {
                page.typeQuickAddWorkItemDesc(titleText);
            } 
        });

        /* Click the save button */
        page.clickQuickAddSave();

        /* Return the newly created workitem */
        browser.wait(until.presenceOf(page.workItemByTitle(titleText)), constants.WAIT, 'Failed to find workItem');
        return page.workItemByTitle(titleText);
    },

    /**
     * Function to create (add) a new workitem
     * 
     * @param
     * page - workitem page
     * workItemTitle - Title string for the new workitem
     * workItemDesc - Description string for the new work item
     * workItemType - Type of the workitem to create
     * assigneeName - User name to whom assign the workitem (optional)
     * 
     */
    createWorkItem: function(page, titleText, descriptionText, workItemType, assigneeName) {  

        testSupport.setBrowserMode('desktop');
        //console.log (theText);

        /* Click the add button */
        page.clickDetailedDialogButton();

        /* Select the workitem type */
        var detailPage = page.clickDetailedIcon("userstory");

        /* Enter the workitem description */
        browser.wait(until.visibilityOf(detailPage.workItemDetailTitle), constants.WAIT, 'Failed to find workItemList');  
        detailPage.setWorkItemDetailTitle (titleText, false);

        /* Select the workitem type */
        browser.wait(until.visibilityOf(detailPage.workItemTitleSaveIcon), constants.WAIT, 'Failed to find workItemList');  
        browser.wait(until.elementToBeClickable(detailPage.workItemTitleSaveIcon), constants.WAIT, 'Failed to find workItemList');  
        detailPage.clickWorkItemTitleSaveIcon();

        /* Enter the workitem description */
        detailPage.clickWorkItemDetailDescription();
        browser.wait(until.visibilityOf(detailPage.workItemDetailDescription), constants.WAIT, 'Failed to find workItemList');  
        detailPage.setWorkItemDetailDescription (titleText, false);
        detailPage.clickWorkItemDescriptionSaveIcon();

        /* Set the assignee */
        if (assigneeName != null) {
            detailPage.workItemDetailAssigneeIcon().click();
            detailPage.setWorkItemDetailAssigneeSearch(assigneeName, false);
            detailPage.clickAssignedUserDropDownList(assigneeName);
        }

        /* Close the workitem add dialog */
        detailPage.clickWorkItemDetailCloseButton();
        browser.wait(until.visibilityOf(page.workItemByTitle(titleText)), constants.WAIT, 'Failed to find workItemList');  
        return page.workItemByTitle(titleText);
    },

    /**
     * Function to assign a workitem
     * 
     * @param
     * page - workitem page
     * theWorkItem - workitem
     * assigneeName - User name to whom assign the workitem
     * 
     */
    assignWorkItem: function(page, theWorkItem, assigneeName) {  

        var tempObject = {};

        testSupport.setBrowserMode('desktop');
        //console.log (theText);

        /* Locate the workitem */
        page.workItemViewId(theWorkItem).getText().then(function (text) { 

            /* Access the workitem's detailpage */
            var detailPage = page.clickWorkItemTitle(theWorkItem, text);

            /* Assign the workitem */
            detailPage.workItemDetailAssigneeIcon().click();
            detailPage.setWorkItemDetailAssigneeSearch(assigneeName, false);
            detailPage.clickAssignedUserDropDownList(assigneeName);

            /* Close the workitem add dialog */
            detailPage.clickWorkItemDetailCloseButton();
            browser.wait(until.visibilityOf(theWorkItem), constants.WAIT, 'Failed to find workItemList');  
        });
    },

    /**
     * Function to verify an assign in a workitem
     * 
     * @param
     * page - workitem page
     * theWorkItem - workitem
     * assigneeName - User name of the expected assignee
     * 
     */
    verifyAssignee: function(page, theWorkItem, assigneeName) {  

        var tempObject = {};

        testSupport.setBrowserMode('desktop');
        //console.log (theText);

        /* Locate the workitem */
        page.workItemViewId(theWorkItem).getText().then(function (text) { 

            /* Access the workitem's detailpage */
            var detailPage = page.clickWorkItemTitle(theWorkItem, text);

            expect(detailPage.details_assigned_user().getText()).toContain(assigneeName);

            /* Close the workitem add dialog */
            detailPage.clickWorkItemDetailCloseButton();
            browser.wait(until.visibilityOf(theWorkItem), constants.WAIT, 'Failed to find workItemList');  
        });
    },


    /**
     * Function to delete a workitem
     * 
     * @param
     * page - workitem page
     * workItemTitle - Title string for the new workitem
     * confirm - Confirm or cancel the deletion
     * 
     */
    deleteWorkItem: function(page, theWorkItem, confirm) {  
        page.clickWorkItemKebabButton(theWorkItem);
        page.clickWorkItemKebabDeleteButton(theWorkItem);
        if (confirm) {
            page.clickWorkItemPopUpDeleteConfirmButton();
        }
        else {
            page.clickWorkItemPopUpDeleteCancelConfirmButton();
        }
    },

    /**
     * Function to set a workitem's title
     * 
     * @param
     * page - workitem page
     * oldTitleText - Original title text
     * newTitleText - Text to add to title
     * append - Boolean, should the new text be appended to the old title 
     * 
     */
    setWorkItemTitle: function(page, oldTitleText, newTitleText, append) {  

        testSupport.setBrowserMode('desktop');
        //console.log (theText);

        page.workItemViewId(page.workItemByTitle(oldTitleText)).getText().then(function (text) { 
            var detailPage = page.clickWorkItemTitle(page.workItemByTitle(oldTitleText), text);

            detailPage.clickWorkItemDetailTitleClick();

            /* Enter the workitem title */
            browser.wait(until.visibilityOf(detailPage.workItemDetailTitle), constants.WAIT, 'Failed to find workItemList');  
            detailPage.setWorkItemDetailTitle (newTitleText, append);

            /* And save it */
            browser.wait(until.visibilityOf(detailPage.workItemTitleSaveIcon), constants.WAIT, 'Failed to find workItemList');  
            browser.wait(until.elementToBeClickable(detailPage.workItemTitleSaveIcon), constants.WAIT, 'Failed to find workItemList');  
            detailPage.clickWorkItemTitleSaveIcon();

            /* Close the workitem add dialog */
            detailPage.clickWorkItemDetailCloseButton();
            if (append) {
                newTitleText = oldTitleText + newTitleText;
            }
            browser.wait(until.visibilityOf(page.workItemByTitle(newTitleText)), constants.WAIT, 'Failed to find workItemList');  
            return page.workItemByTitle(newTitleText);
      });
    },

    /**
     * Function to set a workitem's description
     * 
     * @param
     * page - workitem page
     * titleText - Work item title
     * newDescText - Text to add to description
     * append - Boolean, should the new text be appended to the old description 
     * 
     */
    setWorkItemDescription: function(page, titleText, newDescText, append) {  

        testSupport.setBrowserMode('desktop');
        //console.log (theText);

        page.workItemViewId(page.workItemByTitle(titleText)).getText().then(function (text) { 
            var detailPage = page.clickWorkItemTitle(page.workItemByTitle(titleText), text);

            detailPage.clickWorkItemDetailDescription();

            /* Enter the workitem title */
            browser.wait(until.visibilityOf(detailPage.workItemDetailDescription), constants.WAIT, 'Failed to find workItemList');  
            detailPage.setWorkItemDetailDescription("newDescText", append);

            /* And save it */
            browser.wait(until.visibilityOf(detailPage.workItemDescriptionSaveIcon), constants.WAIT, 'Failed to find workItemList');  
            browser.wait(until.elementToBeClickable(detailPage.workItemDescriptionSaveIcon), constants.WAIT, 'Failed to find workItemList');  
            detailPage.clickWorkItemDescriptionSaveIcon();

            /* Close the workitem add dialog */
            detailPage.clickWorkItemDetailCloseButton();
            browser.wait(until.visibilityOf(page.workItemByTitle(titleText)), constants.WAIT, 'Failed to find workItemList');  
            return page.workItemByTitle(titleText);
      });
    },

};
