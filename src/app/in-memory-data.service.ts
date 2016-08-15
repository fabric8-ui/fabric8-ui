export class InMemoryDataService {
  createDb() {
    let workItems = [
      {id: 21, name: 'Bullet Chart', description: 'Bullet Chart - Conceptual Design', status:'To Do', statusCode:0, type: 'story'},
      {id: 22, name: 'New Account', description: 'Create a New Account', status:'In Progress',statusCode:1, type: 'story'},
      {id: 23, name: 'Login page', description: 'Login page should recognize when caps lock is on and throw a warning message', status:'Done',statusCode:2, type: 'bug'},
      {id: 24, name: 'Splitter', description: 'Splitter - Expand/Collapse snap control',status:'To Do',statusCode:0, type: 'story'},
      {id: 25, name: 'Integrate', description: 'Integrate PatternFly UI elements',status:'In Progress',statusCode:1, type: 'story'},
      {id: 26, name: 'Log Viewer', description: 'Log Viewer - Conceptual Design',status:'To Do',statusCode:0, type: 'story'},
      {id: 13, name: 'Bootstrap', description: 'PatternFly and Bootstrap 4',status:'Done',statusCode:2, type: 'story'},
      {id: 14, name: 'Travis', description: 'Investigate Travis CI Integration',status:'Done',statusCode:2, type: 'story'},
      {id: 15, name: 'Links', description: 'Broken Links',status:'Done',statusCode:2, type: 'bug'},
      {id: 16, name: 'Best Practice', description: 'Code Organization and Best Practice',status:'To Do',statusCode:0, type: 'story'},
      {id: 17, name: 'Max Width', description: 'Max Width Container',status:'Done',statusCode:2, type: 'bug'},
      {id: 18, name: 'Font', description: 'Improve Font Weight Management Across Less File',status:'In Progress',statusCode:1, type: 'story'},
      {id: 19, name: 'Color', description: 'Improve Color Management',status:'In Progress',statusCode:1, type: 'bug'},
      {id: 20, name: 'Empty State', description: 'Empty State - Additional Layout Example',status:'To Do',statusCode:0, type: 'bug'}
    ];
    return {workItems};
  }
}
