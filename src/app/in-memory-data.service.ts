export class InMemoryDataService {
  createDb() {
    let workItems = [
      {"fields":{"system.owner":"tmaeder","system.state":"open"},"id": 21, "name": 'Bullet Chart', description: 'Bullet Chart - Conceptual Design',"workItemType":"1","version":0 , status:'To Do', statusCode:0, type: 'story'},
      {"fields":{"system.owner":"tmaeder","system.state":"open"},id: 22, name: 'New Account', description: 'Create a New Account',"workItemType":"1","version":0 , status:'In Progress',statusCode:1, type: 'story'},
      {"fields":{"system.owner":"tmaeder","system.state":"open"},id: 23, name: 'Login page', description: 'Login page should recognize when caps lock is on and throw a warning message',"workItemType":"1","version":0 , status:'Done',statusCode:2, type: 'bug'},
      {"fields":{"system.owner":"tmaeder","system.state":"open"},id: 24, name: 'Splitter', description: 'Splitter - Expand/Collapse snap control',"workItemType":"1","version":0 ,status:'To Do',statusCode:0, type: 'story'},
      {"fields":{"system.owner":"tmaeder","system.state":"open"},id: 25, name: 'Integrate', description: 'Integrate PatternFly UI elements',"workItemType":"1","version":0 ,status:'In Progress',statusCode:1, type: 'story'},
      {"fields":{"system.owner":"tmaeder","system.state":"open"},id: 26, name: 'Log Viewer', description: 'Log Viewer - Conceptual Design',"workItemType":"1","version":0 ,status:'To Do',statusCode:0, type: 'story'},
      {"fields":{"system.owner":"tmaeder","system.state":"open"},id: 13, name: 'Bootstrap', description: 'PatternFly and Bootstrap 4',"workItemType":"1","version":0 ,status:'Done',statusCode:2, type: 'story'},
      {"fields":{"system.owner":"tmaeder","system.state":"open"},id: 14, name: 'Travis', description: 'Investigate Travis CI Integration',"workItemType":"1","version":0 ,status:'Done',statusCode:2, type: 'story'},
      {"fields":{"system.owner":"tmaeder","system.state":"open"},id: 15, name: 'Links', description: 'Broken Links',"workItemType":"1","version":0 ,status:'Done',statusCode:2, type: 'bug'},
      {"fields":{"system.owner":"tmaeder","system.state":"open"},id: 16, name: 'Best Practice', description: 'Code Organization and Best Practice',"workItemType":"1","version":0 ,status:'To Do',statusCode:0, type: 'story'},
      {"fields":{"system.owner":"tmaeder","system.state":"open"},id: 17, name: 'Max Width', description: 'Max Width Container',"workItemType":"1","version":0 ,status:'Done',statusCode:2, type: 'bug'},
      {"fields":{"system.owner":"tmaeder","system.state":"open"},id: 18, name: 'Font', description: 'Improve Font Weight Management Across Less File',"workItemType":"1","version":0 ,status:'In Progress',statusCode:1, type: 'story'},
      {"fields":{"system.owner":"tmaeder","system.state":"open"},id: 19, name: 'Color', description: 'Improve Color Management',"workItemType":"1","version":0 ,status:'In Progress',statusCode:1, type: 'bug'},
      {"fields":{"system.owner":"tmaeder","system.state":"open"},id: 20, name: 'Empty State', description: 'Empty State - Additional Layout Example',"workItemType":"1","version":0 ,status:'To Do',statusCode:0, type: 'bug'}
    ];
    return {workItems};
  }
}
