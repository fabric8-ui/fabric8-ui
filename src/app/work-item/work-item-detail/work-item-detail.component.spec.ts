import {
  async,
  ComponentFixture,
  fakeAsync,
  inject,
  TestBed,
  tick
} from '@angular/core/testing';

import { Location }            from '@angular/common';
import { SpyLocation }         from '@angular/common/testing';
import { DebugElement }        from '@angular/core';
import { FormsModule }         from '@angular/forms';
import { By }                  from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import { AlmTrim } from '../../pipes/alm-trim';
import { Logger } from '../../shared/logger.service';

import { Dialog } from '../../shared-component/dialog/dialog';
import { DialogComponent } from '../../shared-component/dialog/dialog.component';

import { FooterComponent } from '../../footer/footer.component';
import { HeaderComponent } from '../../header/header.component';

import { WorkItem } from '../work-item';
import { WorkItemService } from '../work-item.service';

import { WorkItemDetailComponent } from './work-item-detail.component';

describe('Detailed view and edit a selected work item - ', () => {
  let comp: WorkItemDetailComponent;
  let fixture: ComponentFixture<WorkItemDetailComponent>;
  let el: DebugElement;
  let el1: DebugElement;
  let logger: Logger;

  let dialog: Dialog;

  let fakeWorkItem: WorkItem;
  let fakeService: any;

  beforeEach(() => {
    dialog = {
      'title' : 'Changes have been made',
      'message' : 'Do you want to discard your changes?',
      'actionButtons': [
        {'title': ' Discard', 'value': 1},
        {'title': 'Cancel', 'value': 0}]
    } as Dialog;

    fakeWorkItem = {
      'fields': {
        'system.assignee': 'me',
        'system.creator': 'me',
        'system.description': 'description',
        'system.state': 'new',
        'system.title': 'My work item'
      },
      'id': '1',
      'type': 'system.userstory',
      'version': 0
    } as WorkItem;

    fakeService = {
      create: function () {
        return new Promise((resolve, reject) => {
          resolve(fakeWorkItem);
        });
      },
      update: function () {
        return new Promise((resolve, reject) => {
          resolve(fakeWorkItem);
        });
      }
    };
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        RouterTestingModule.withRoutes([
          {path: 'detail/1', component: WorkItemDetailComponent}
        ])],

      declarations: [
        WorkItemDetailComponent,
        HeaderComponent,
        FooterComponent,
        AlmTrim,        
        DialogComponent
      ],
      providers: [
        Logger,
        WorkItemService,
        Location,
        {
          provide: WorkItemService,
          useValue: fakeService
        }
      ]
    }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(WorkItemDetailComponent);
        comp = fixture.componentInstance;
      });
  }));

  it('Page title should have the work item title',
    fakeAsync(() => {
      fixture.detectChanges();
      el = fixture.debugElement.query(By.css('h1'));
      comp.workItem = fakeWorkItem;
      fixture.detectChanges();
      comp.save();
      tick();
      expect(el.nativeElement.textContent).toContain(fakeWorkItem.fields['system.title']);
    }));

  it('Page should display work item ID',
    fakeAsync(() => {
      fixture.detectChanges();
      el = fixture.debugElement.query(By.css('#wi-detail-id'));
      comp.workItem = fakeWorkItem;
      fixture.detectChanges();
      comp.save();
      tick();
      expect(el.nativeElement.textContent).toContain(fakeWorkItem.id);
    }));

  it('Page should display work item title',
    fakeAsync(() => {
      fixture.detectChanges();
      el = fixture.debugElement.query(By.css('#wi-detail-title'));
      comp.workItem = fakeWorkItem;
      fixture.detectChanges();
      comp.save();
      tick();
      expect(el.nativeElement.value).toContain(fakeWorkItem.fields['system.title']);
    }));

  it('Save should be enabled if a valid work item title has been entered',
    fakeAsync(() => {
      fixture.detectChanges();
      el = fixture.debugElement.query(By.css('#workItemDetail_btn_save'));
      comp.workItem.fields['system.title'] = 'Valid work item title';
      fixture.detectChanges();
      comp.save();
      tick();
      expect(el.attributes['disabled']).toBeFalsy();
    }));

  it('Work item ID cannot be edited (change model) ',
    fakeAsync(() => {
      fixture.detectChanges();
      comp.workItem = fakeWorkItem;
      el = fixture.debugElement.query(By.css('#wi-detail-id'));
      comp.workItem.id = 'New ID';
      fixture.detectChanges();
      comp.save();
      tick();
      expect(el.nativeElement.textContent).not.toEqual(comp.workItem.id);
    }));

  it('Work item ID cannot be edited (change html) ',
    fakeAsync(() => {
      fixture.detectChanges();
      comp.workItem = fakeWorkItem;
      el = fixture.debugElement.query(By.css('#wi-detail-id'));
      el.nativeElement.textContent = 'New ID';
      fixture.detectChanges();
      comp.save();
      tick();
      expect(comp.workItem.id).not.toEqual(el.nativeElement.textContent);
    }));

  it('Work item title can be edited ',
    fakeAsync(() => {
      fixture.detectChanges();
      comp.workItem = fakeWorkItem;
      el = fixture.debugElement.query(By.css('#wi-detail-title'));
      el.nativeElement.value = 'User entered work item title';
      fixture.detectChanges();
      comp.save();
      tick();
      expect(comp.workItem.fields['system.title']).toContain(el.nativeElement.value);
    }));

  it('Work item description can be edited ',
    fakeAsync(() => {
      fixture.detectChanges();
      comp.workItem = fakeWorkItem;
      el = fixture.debugElement.query(By.css('#wi-detail-desc'));
      el.nativeElement.value = 'User entered work item description';
      fixture.detectChanges();
      comp.save();
      tick();
      expect(comp.workItem.fields['system.description']).toContain(el.nativeElement.textContent);
    }));

  it('Work item type can be edited ',
    fakeAsync(() => {
      fixture.detectChanges();
      comp.workItem = fakeWorkItem;
      el = fixture.debugElement.query(By.css('#wi-detail-type'));
      el.nativeElement.value = 'system.experience';
      fixture.detectChanges();
      comp.save();
      tick();
      expect(comp.workItem.type).toContain(el.nativeElement.value);
    }));

  it('Work item assignee can be edited ',
    fakeAsync(() => {
      fixture.detectChanges();
      comp.workItem = fakeWorkItem;
      el = fixture.debugElement.query(By.css('#wi-detail-assignee'));
      el.nativeElement.value = 'me a user';
      fixture.detectChanges();
      comp.save();
      tick();
      expect(comp.workItem.fields['system.assignee']).toContain(el.nativeElement.value);
    }));

  it('Work item creator can be edited ',
    fakeAsync(() => {
      fixture.detectChanges();
      comp.workItem = fakeWorkItem;
      el = fixture.debugElement.query(By.css('#wi-detail-creator'));
      el.nativeElement.value = 'me a creator';
      fixture.detectChanges();
      comp.save();
      tick();
      expect(comp.workItem.fields['system.creator']).toContain(el.nativeElement.value);
    }));

  it('Work item state can be edited ',
    fakeAsync(() => {
      fixture.detectChanges();
      comp.workItem = fakeWorkItem;
      el = fixture.debugElement.query(By.css('#wi-detail-state'));
      el.nativeElement.value = 'resolved';
      fixture.detectChanges();
      comp.save();
      tick();
      expect(comp.workItem.fields['system.state']).toContain(el.nativeElement.value);
    }));

  it('Save should be disabled if work item\'s title has only whitespace',
    fakeAsync(() => {
      fixture.detectChanges();
      el = fixture.debugElement.query(By.css('#workItemDetail_btn_save'));
      comp.workItem.fields['system.title'] = '       ';
      fixture.detectChanges();
      comp.save();
      tick();
      expect(el.attributes['disabled']).toBeFalsy();            
    }));

  it('Save should be disabled if the work item\'s title is blank',
    fakeAsync(() => {
      fixture.detectChanges();
      el = fixture.debugElement.query(By.css('#workItemDetail_btn_save'));
      comp.workItem.fields['system.title'] = '';
      fixture.detectChanges();
      comp.save();
      tick();
      //Save button will NOT have the btn-primary class
      expect(el.classes['btn-primary']).toBeFalsy();
    }));

  it('Navigate when Back is clicked without making any changes',
    inject([Location], fakeAsync((location: Location) => {
      spyOn(location, 'back');
      fixture.detectChanges();
      el = fixture.debugElement.query(By.css('#workItemDetail_btn_back'));
      el.triggerEventHandler('click', null);
      tick();
      expect(location.back).toHaveBeenCalled();
    })));

  it('Display confrimation dialog when Back is clicked after making changes',
    inject([Location], fakeAsync((location: Location) => {
      spyOn(location, 'back');
      fixture.detectChanges();
      comp.workItem = fakeWorkItem;
      el1 = fixture.debugElement.query(By.css('#wi-detail-title'));
      el1.nativeElement.value = 'User entered work item title';      
      fixture.detectChanges();
      tick();
      comp.goBack(true);
      expect(location.back).not.toHaveBeenCalled();
    })));


  it('Navigate when work item form has been submitted and submit resolves',
    inject([Location], fakeAsync((location: Location) => {
      spyOn(location, 'back');
      fixture.detectChanges();
      comp.workItem = fakeWorkItem;
      el = fixture.debugElement.query(By.css('#wi-detail-form'));
      el.triggerEventHandler('submit', null);
      tick();
      expect(location.back).toHaveBeenCalled();
    })));

});
