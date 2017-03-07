export class WorkItemType {
    id: string;
    type: string;
    attributes: {
        name: string;
        version: number;
        description: string;
        icon: string;
        fields:
        {
            'system.area': any,
            'system.created_at': any,
            'system.assignee': any,
            'system.creator': any,
            'system.description': any,
            'system.iteration': any,
            'system.remote_item_id': any,
            'system.state': any,
            'system.title': any,
        };
    };
}
