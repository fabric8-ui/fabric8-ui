import { async } from '@angular/core/testing';

import { IterationMapper, IterationUI, IterationModel } from './iteration.model';

describe('IterationMapper', () => {
    let iterationMapper: IterationMapper;
    let iterationUI: IterationUI;
    let iterationModel: IterationModel;

    iterationUI = {
        id: '',
        name: '',
        parentPath: '',
        resolvedParentPath: '',
        userActive: false,
        activeStatus: false,
        startAt: '',
        endAt: '',
        description: '',
        state: 'new',
        link: '',
        workItemCount: 0,
        type: 'iterations',
    } as IterationUI;

    iterationModel  = {
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
      } as IterationModel;
    
    beforeEach(async(() => {
        iterationMapper = new IterationMapper();
    }));

    it('Instance of IterationMapper should be created', () => {
        expect(iterationMapper).toBeTruthy();
    });
  
    it('UI Model mapped to Service Model', () => {
        expect(iterationMapper.toServiceModel(iterationUI)).toEqual(iterationModel);
    });

    it('Service Model mapped to UI Model', () => {
        expect(iterationMapper._utilMapperUIModel(iterationModel)).toEqual(iterationUI);
    });
});