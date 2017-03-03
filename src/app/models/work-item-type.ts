export class WorkItemType {
    id: string;
    type: string;
    attributes: {
        name: string;
        version: number;
        description: string;
        fields:
        {
            'system.area': {}, 
            'system.created_at': {}, 
            'system.assignee': {},        
            'system.creator': {},
            'system.description': {},            
            'system.iteration': {},            
            'system.remote_item_id': {},            
            'system.state': {},            
            'system.title': {},
        };
    };
}