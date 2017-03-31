import {
  async,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import {
  BsDropdownConfig,
  BsDropdownModule,
} from 'ng2-bootstrap';

import { Action } from '../config/action';
import { ActionsConfig } from '../config/actions-config';
import { ListViewComponent } from './listview.component';
import { ListViewConfig } from './listview-config';
import { View } from '../config/view';
import { ViewsConfig } from '../config/views-config';

describe('Toolbar component - ', () => {
  let comp: ListViewComponent;
  let fixture: ComponentFixture<ListViewComponent>;
  let config: ListViewConfig;

  beforeEach(() => {
    config = {
      actionsConfig: {
        primaryActions: [
          {
            id: 'action1',
            name: 'Action 1',
            title: 'Do the first thing'
          },
          {
            id: 'action2',
            name: 'Action 2',
            title: 'Do something else'
          }
        ],
        moreActions: [
          {
            id: 'moreActions1',
            name: 'Action',
            title: 'Perform an action'
          },
          {
            id: 'moreActions2',
            name: 'Another Action',
            title: 'Do something else'
          },
          {
            disabled: true,
            id: 'moreActions3',
            name: 'Disabled Action',
            title: 'Unavailable action',
          },
          {
            id: 'moreActions4',
            name: 'Something Else',
            title: ''
          },
          {
            id: 'moreActions5',
            name: '',
            separator: true
          },
          {
            id: 'moreActions6',
            name: 'Grouped Action 1',
            title: 'Do something'
          },
          {
            id: 'moreActions7',
            name: 'Grouped Action 2',
            title: 'Do something similar'
          }
        ]
      } as ActionsConfig,
    } as ListViewConfig;
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, BsDropdownModule],
      declarations: [ListViewComponent],
      providers: [BsDropdownConfig]
    })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(ListViewComponent);
          comp = fixture.componentInstance;
          comp.config = config;
          fixture.detectChanges();
        });
  }));

  // ??? tests

});
