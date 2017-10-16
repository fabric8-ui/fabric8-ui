/**Note on screen resolutions - See: http://www.itunesextractor.com/iphone-ipad-resolution.html
 * Tests will be run on these resolutions:
 * - iPhone6s - 375x667
 * - iPad air - 768x1024
 * - Desktop -  1920x1080
 *
 * beforeEach will set the mode to Desktop. Any tests requiring a different resolution will must set explicitly.
 *
 * @author naina-verma
 */

var WorkItemListPage = require('./page-objects/work-item-list.page'),
  constants = require('./constants'),
  testSupport = require('./testSupport');
  WorkItemDetailPage = require('./page-objects/work-item-detail.page'),
  WorkBoardPage = require('./page-objects/work-item-board.page'),
describe('Work board tests :: ', function () {
  var page, items, browserMode;
  page = new WorkItemListPage(true);
  detailPage = new WorkItemDetailPage(true);
  var until = protractor.ExpectedConditions;
  var waitTime = 30000;

  beforeEach(function () {
    testSupport.setBrowserMode('desktop');
    boardPage = new WorkBoardPage(true);
  });

/*  it( 'Verify Board elements are present -desktop ', function() {
        var stateList = typesOfStatesList();
        var countstateList = totalCountOftypesOfStatesList();
        verifytypesOfStates(stateList,'false','false');
        verifytotalCountPertypesOfStates(countstateList,'false','false');
  });

  it( 'Shuffle Board elements New to Open  -desktop ', function() {
        var stateList = typesOfStatesList();  
        boardPage.getBoardById("id-1");
        browser.wait(until.elementToBeClickable(detailPage.workItemStateDropDownButton), constants.WAIT, 'Failed to find workItemStateDropDownButton');   
        detailPage.clickWorkItemStateDropDownButton();
        detailPage.WorkItemStateDropDownList().get(1).click();
        detailPage.clickWorkItemDetailCloseButton();
        browser.wait(until.elementToBeClickable(page.spaceDropdown), constants.WAIT, 'Failed to find elemet');     
        // page.clickOnSpaceDropdown();
        // page.selectSpaceDropDownValue("3");
        browser.wait(until.elementToBeClickable(page.openButton), constants.WAIT, 'Failed to find elemet'); 
        var countstateList = totalCountOftypesOfStatesList();
        verifytotalCountPertypesOfStates(countstateList,'1','1'); 

  });

  it( '1.1 Shuffle Board elements Open to inProgress -desktop ', function() {
        var stateList = typesOfStatesList();   
        boardPage.getBoardById("id-5");
        browser.wait(until.elementToBeClickable(detailPage.workItemStateDropDownButton), constants.WAIT, 'Failed to find workItemStateDropDownButton');   
        detailPage.clickWorkItemStateDropDownButton();
        detailPage.WorkItemStateDropDownList().get(2).click();
        detailPage.clickWorkItemDetailCloseButton();
        browser.wait(until.elementToBeClickable(page.spaceDropdown), constants.WAIT, 'Failed to find elemet'); 
        browser.wait(until.elementToBeClickable(page.openButton), constants.WAIT, 'Failed to find elemet'); 
        countstateList = totalCountOftypesOfStatesList();
        verifytotalCountPertypesOfStates(countstateList,'2','5');       

  });

  it( 'Shuffle Board elements inProgress- resolved  -desktop ', function() {
        var stateList = typesOfStatesList();  
        boardPage.getBoardById("id-3");
        browser.wait(until.elementToBeClickable(detailPage.workItemStateDropDownButton), constants.WAIT, 'Failed to find workItemStateDropDownButton');   
        detailPage.clickWorkItemStateDropDownButton();
        detailPage.WorkItemStateDropDownList().get(3).click();
        detailPage.clickWorkItemDetailCloseButton();
        browser.wait(until.elementToBeClickable(page.spaceDropdown), constants.WAIT, 'Failed to find elemet'); 
        browser.wait(until.elementToBeClickable(page.openButton), constants.WAIT, 'Failed to find elemet'); 
        var countstateList = totalCountOftypesOfStatesList();
        verifytotalCountPertypesOfStates(countstateList,'3','1');

  });

  it( '2.1 Shuffle Board elements inProgress- open -desktop ', function() {
        var stateList = typesOfStatesList();
        boardPage.getBoardById("id-3");
        browser.wait(until.elementToBeClickable(detailPage.workItemStateDropDownButton), constants.WAIT, 'Failed to find workItemStateDropDownButton');   
        detailPage.clickWorkItemStateDropDownButton();
        detailPage.WorkItemStateDropDownList().get(1).click();
        detailPage.clickWorkItemDetailCloseButton();
        browser.wait(until.elementToBeClickable(page.spaceDropdown), constants.WAIT, 'Failed to find elemet'); 
        browser.wait(until.elementToBeClickable(page.openButton), constants.WAIT, 'Failed to find elemet'); 
        countstateList = totalCountOftypesOfStatesList();
        verifytotalCountPertypesOfStates(countstateList,'1','1');       

  });

  it( 'Verify Board Filter elements are present -desktop ', function() {
       expect(boardPage.getFilterWITButton().isPresent()).toBe(true);
       expect(boardPage.getTextFilterWITButton()).toBe("Planner Item");
       var list = ['Fundamental','Experience','Scenario','Feature','Bug','User Story'];
       for (var i=0;i<list.length;i++){
            boardPage.clickFilterWITButton();
            boardPage.clickWITFilterDropDownElements(list[i]);
            expect(boardPage.getFilterWITButton().isPresent()).toBe(true);
            expect(boardPage.getTextFilterWITButton()).toBe(list[i]);
       }
  });

  it( 'Verify On change filters types represent correct data -desktop ', function() {
        var list = ['User Story'];
        //Few filters are pending due to : https://github.com/fabric8-ui/fabric8-planner/issues/1255
      //  var list = ['User Story','Value Proposition','Fundamental','Experience','Scenario','Feature','Bug','User Story'];
       for (var i=0;i<list.length;i++){
            boardPage.clickFilterWITButton();
            boardPage.clickWITFilterDropDownElements(list[i]);
            expect(boardPage.getFilterWITButton().isPresent()).toBe(true);
            expect(boardPage.getTextFilterWITButton()).toBe(list[i]);
            countstateList = totalCountOftypesOfStatesList();
            if(list[i]== 'User Story'){
            verifytotalCountPertypesOfStates(countstateList,'0','8');
            }
            if(list[i]=='Value Proposition'){
              verifytotalCountPertypesOfStates(countstateList,'0','8'); 
            }
       }
  });
*/
  
});

  var typesOfStatesList = function(){
          var typesOfStates = new Array();
          for (var i = 1; i <= 5;  i++) {
          typesOfStates.push(boardPage.getTypesOfStates(i));
          }
          return typesOfStates;
    };
   var totalCountOftypesOfStatesList = function  (){
        var totalCountOftypesOfStates = new Array();
        for (var i = 1; i <= 5;  i++) {
          totalCountOftypesOfStates.push(boardPage.getTotalCountPerStateType(i));
          }
          return totalCountOftypesOfStates;
    };

   var verifytypesOfStates = function  (typesOfStates,index,expectedValue){
        var actualArray = new Array('new','open', 'in progress', 'resolved','closed');
         if(index == 'false'){
         for (var i = 0; i < 5;  i++) {
          expect(typesOfStates[i]).toBe(actualArray[i]);
          }
         }
         else if(expectedValue != 'false'){
          expect(expectedValue).toBe(typesOfStates[index]);
          }
         else {
          expect(typesOfStates[index]).toBe(actualArray[index]);
         }
    };
    
   var verifytotalCountPertypesOfStates = function(totalCountOftypesOfStates,index,expectedValue){
        var actualTotalCountOftypesOfStates = new Array('8','0','4','0','0');
        if(index == 'false'){
        for (var i=0;  i < 5;  i++ ){
          expect(totalCountOftypesOfStates[i]).toBe(actualTotalCountOftypesOfStates[i]);
        }
        }
        else if(expectedValue != 'false'){
          expect(expectedValue).toBe(totalCountOftypesOfStates[index]);
        }
        else {
          expect(totalCountOftypesOfStates[index]).not.toBe(actualTotalCountOftypesOfStates[index]);
         }

    };
