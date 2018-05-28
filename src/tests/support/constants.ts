export class Constants {
  attribute1 = "Iteration";
  attribute2 = "Label";
  attribute3 = "Creator";
  attribute4 = "Assignees";
  dropdownareaTitle1 = 'Area_1';
  dropdownareaTitle2 = 'Area_2';  
  dropdownIteration1 = 'Iteration_1/Iteration1_1';
  dropdownIteration2 = 'Iteration_1';
  dropdownIteration_2 = 'Iteration_2';
  label = 'sample_label_1';
  updateIteration = 'Iteration_2123'
  label1 = 'Example Label 1';
  label2 = 'sample_label_2';
  linkType = 'blocks';
  newLabel = "new label";
  newLabel1 = "new label 1";
  newIteration ='new Iteration';
  newIteration1 ='new Iteration 1';
  areaTitle1 = '/' + process.env.SPACE_NAME + '/Area_1';
  areaTitle2 = '/' + process.env.SPACE_NAME + '/Area_2';
  iteration1 = '/' + process.env.SPACE_NAME + '/Iteration_1/Iteration1_1';
  iteration2 = '/' + process.env.SPACE_NAME + '/Iteration_2';
  parentIteration = 'Iteration_2';
  iteration3 = '/' + process.env.SPACE_NAME;
  newWorkItem1 = {
    title: "Workitem Title",
    description: "Describes the work item"
  };
  newWorkItem2 = {
    title: "Workitem Title 1"
  };
  newWorkItem3 = {
    title:  "New Workitem"
  };
  updatedWorkItem = {
    title: 'New Workitem Title',
    description: 'New WorkItem Description'
  };
  workItemTitle2 = 'Workitem_Title_2';
  user1 = process.env.USER_FULLNAME;
  editWorkItemTitle1 = 'Title Text "<0>"';
  // Required since we need 2 users. Do not remove
  user2 = this.user1;
  user_avatar = 'https://www.gravatar.com/avatar/f56b4884b4041f14b13d919008fd7d44.jpg&s=20';
  comment = "new comment";
  randomText = "zxz"
}
