import { WorkItemMapper, WorkItemUI, WorkItemService } from './work-item';
import { WorkItemTypeUI, WorkItemTypeService } from './work-item-type';

describe('IterationMapper', () => {
    let workItemMapper: WorkItemMapper;
    let workItemUI: WorkItemUI;
    let workItemService: WorkItemService;

    workItemUI = {
        id: '',
        title: '',
        version: 0,
        type: {
            id: '',
            name: '',
            icon: '',
            version: 0,
            type: '',
            description: ''
        } as WorkItemTypeUI
    } as WorkItemUI;

    workItemService = {
        id: '',
        attributes: {
            'system.title': '',
            version: 0
        },
        relationships: {
            baseType: {
                data: {
                    id: '',
                    type: '',
                    attributes: {
                        name: '',
                        version: 0,
                        description: '',
                        icon: '',
                    }
                } as WorkItemTypeService
            }
        } 
    } as WorkItemService
    
    beforeEach(() => {
        workItemMapper = new WorkItemMapper();
    });

    it('should execute the canary test', () => {
        return expect(true).toBe(true)
      });
  
    it('should correctly convert to service model - 1', () => {
        expect(workItemMapper.toServiceModel(workItemUI)).toEqual(workItemService);
    });

    it('should correctly convert to UI model - 2', () => {
        expect(workItemMapper.toUIModel(workItemService)).toEqual(workItemUI);
    });
});