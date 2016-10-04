import { InMemoryDbService } from 'angular-in-memory-web-api';
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    let workitems = [1,2,3,4,5,6,7,8,9,10,11,12,13,14].map((n) => {
      return {"fields":{"system.assignee":"someUser"+n,"system.creator":"someOtherUser"+n,"system.description":"Some Description "+n,"system.state":"new","system.title":"Some Title "+n},"id":""+n,"type":"system.userstory","version":1};
    });

    let loginStatus = {
      "status": 200,
      "responseText": "Good Job"
    };

    return {loginStatus, workitems};
  }
}