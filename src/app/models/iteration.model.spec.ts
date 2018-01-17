import { async } from '@angular/core/testing';

import { IterationMapper, IterationUI, IterationService } from './iteration.model';

describe('IterationMapper', () => {
    let iterationMapper: IterationMapper;
    let iterationUI: IterationUI;
    let iterationService: IterationService;

    iterationUI = {
        id: '',
        name: '',
        parentPath: '',
        resolvedParentPath: '',
        userActive: false,
        isActive: false,
        startAt: '',
        endAt: '',
        description: '',
        state: 'new',
        link: '',
        workItemTotalCount: 0,
        type: 'iterations',
    } as IterationUI;

    iterationService  = {
        attributes: {
          user_active: false,
          name: '',
          description: '',
          state: 'new',
          parent_path: '',
          resolved_parent_path: '',
          startAt: '',
          endAt: ''
        },
        id: '',
        links: {
            self: '',
        },
        relationships: {
            workitems: {
                meta: {
                    total: 0
                }
            }
        },
        type: 'iterations'
      } as IterationService;
    
    beforeEach(async(() => {
        iterationMapper = new IterationMapper();
    }));

    it('should execute the canary test', () => {
        return expect(true).toBe(true)
      });
  
    it('should correctly convert to service model - 1', () => {
        expect(iterationMapper.toServiceModel(iterationUI)).toEqual(iterationService);
    });

    it('should correctly convert to UI model - 2', () => {
        expect(iterationMapper.toUIModel(iterationService)).toEqual(iterationUI);
    });
});