import { Component, OnInit, Input, ViewChild, HostListener }      from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location }               from '@angular/common';
import { Router }            from '@angular/router';

import { AuthenticationService } from './../../../auth/authentication.service';
import { Broadcaster } from './../../../shared/broadcaster.service';
import { Logger } from './../../../shared/logger.service';

import { WorkItem } from './../../work-item';
import { WorkItemType } from './../../work-item-type';
import { WorkItemService } from './../../work-item.service';

@Component({
  selector: 'alm-work-item-detail',
  templateUrl: './work-item-detail.component.html',
  styleUrls: ['./work-item-detail.component.scss'],
})

export class WorkItemDetailComponent implements OnInit {
  @ViewChild('desc') description: any;
  @ViewChild('title') title: any;

  workItem: WorkItem;
  workItemTypes: WorkItemType[];
  // TODO: These should be read from the WorkitemType of the given Workitem
  workItemStates: Object[];

  showDialog: boolean = false;
  
  submitted = false;
  active = true;
  loggedIn: Boolean = false;

  headerEditable: Boolean = false;
  descEditable: Boolean = false;
  
  validTitle: Boolean = true;
  titleText: any = '';
  descText: any = '';

  constructor(
    private auth: AuthenticationService,    
    private broadcaster: Broadcaster,    
    private workItemService: WorkItemService,
    private route: ActivatedRoute,
    private location: Location,
    private logger: Logger,
    private router: Router
  ) {}

  ngOnInit(): void{     
    this.listenToEvents();
    this.getWorkItemTypesandStates();
    this.loggedIn = this.auth.isLoggedIn();
    this.route.params.forEach((params: Params) => {
      if (params['id'] !== undefined) {
        let id = params['id'];
        this.workItemService.getWorkItem(id)
          .then(workItem => {
            this.resetEditables();
            this.titleText = workItem.fields['system.title'];
            this.descText = workItem.fields['system.description'];
            this.workItem = workItem;
            this.activeOnList(400);
          })
          .catch(err => this.closeDetails());
      }
    });
  }

  activeOnList(timeOut: number = 0) {
    setTimeout(() => {
      this.broadcaster.broadcast('activeWorkItem', this.workItem.id);      
    }, timeOut);
  }

  checkTitle(event: any): void {
    this.titleText = event;
    this.isValid(this.titleText);
  }

  isValid(checkTitle: String): void {
    this.validTitle = checkTitle.trim() != '';
  }

  descUpdate(event: any): void {
    this.descText = event;
  }

  toggleHeader(internal: Boolean = false): void{
    if (this.descEditable && !internal) {
      this.onUpdateDescription();
    }
    if (this.loggedIn) {
      this.headerEditable = !this.headerEditable;
    }
  }

  toggleDescription(internal: Boolean = false, 
                    onlyOpen: Boolean = false): void{
    if (this.headerEditable && !internal) {
      this.onUpdateTitle();
    }
    if (this.loggedIn) {
      if (onlyOpen) {
        this.descEditable = true;  
      } else {
        this.descEditable = !this.descEditable;
      }
    }
  }

closeDescription(): void {
    this.description.nativeElement.innerHTML = 
    this.workItem.fields['system.description']; 
    this.descEditable = false;
  }

  getWorkItemTypesandStates(): void {
    this.workItemService.getWorkItemTypes()
      .then((types) => {
        this.workItemTypes = types;
      })
      .then(() => {
        this.workItemService.getStatusOptions()
          .then((options) => {
            this.workItemStates = options;
        });
      });
  }

  onChangeState(option: any): void {
    this.workItem.fields['system.state'] = option;
    this.save();
  }

  onChangeType(type: any): void {
    this.workItem.type = type;
    this.save();
  }

  onUpdateDescription(): void {
    this.workItem.fields['system.description'] = this.descText.trim();
    this.save();
    this.toggleDescription(true);
  }

  onUpdateTitle(): void {
    this.isValid(this.titleText.trim());
    if (this.validTitle) {
      this.workItem.fields['system.title'] = this.titleText;
      this.save();
      this.toggleHeader(true);
    }    
  }

  save(): void {
    this.workItemService
      .update(this.workItem)
      .then((workItem) => {
        this.workItem.version = workItem.version;
        this.broadcaster.broadcast('updateWorkItem', workItem);
        this.activeOnList();          
    });
     
  }

  closeDetails(): void {
    this.router.navigate(['/work-item-list']);
  }

  listenToEvents() {
    this.broadcaster.on<string>('logout')
      .subscribe(message => {
        this.loggedIn = false;
    });
  }
  
  keyMaps(event: KeyboardEvent) {                
    if (this.headerEditable || this.descEditable){           
      this.save();
      if (this.headerEditable) this.toggleHeader(); 
      if (this.descEditable) this.toggleDescription();      
    }
  }

  preventDef(event: any) {
    event.preventDefault();
  }

  resetEditables() {
    this.headerEditable = false;
    this.descEditable = false;
  }

  @HostListener('window:keydown', ['$event']) 
  onKeyEvent(event: any) {
    event = (event || window.event);
    // for ESC key handling
    if (event.keyCode == 27) {
      try { 
        event.preventDefault(); //Non-IE
      } catch (x){
        event.returnValue = false; //IE
      }
      if (this.descEditable) {
        this.closeDescription();
      } else if (this.headerEditable) {
        this.headerEditable = false;
      } else {
        this.closeDetails();
      }
    }
  }
}