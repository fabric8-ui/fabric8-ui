import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Http } from '@angular/http';
import { cloneDeep } from 'lodash';

import { Link } from '../../../../models/link';
import { LinkDict } from '../../../../models/work-item';
import { LinkType, MinimizedLinkType } from '../../../../models/link-type';
import { WorkItem } from '../../../../models/work-item';
import { WorkItemService } from '../../../work-item.service';

import { SearchData } from './search-data';

@Component({
    selector: 'alm-work-item-link',
    templateUrl: './work-item-link.component.html',
    styleUrls: ['./work-item-link.component.scss'],
    // styles:['.completer-input {width:100%;float:left;};.completer-dropdown-holder {width:100%;float:left;}']
})
export class WorkItemLinkComponent implements OnInit, OnChanges {
    @Input() workItem: WorkItem;
    @Input() loggedIn: Boolean;
    linkTypes : LinkType[];
    link: Object;
    selectedWorkItem: Object = {};
    selectedLinkType: any = false;
    searchWorkItem : SearchData;
    showLinkComponent: Boolean = false;
    showLinkView: Boolean = false;
    showLinkCreator: Boolean = true;
    // showLinksList : Boolean = false;
    constructor (
        private workItemService: WorkItemService,
        private router: Router,
        http: Http
    ){
        this.searchWorkItem = new SearchData(http);
    }

    ngOnInit() {
      this.loadLinkTypes();
    }

    ngOnChanges(changes: SimpleChanges){
        this.loadLinkTypes();
        this.showLinkComponent = false;
        this.showLinkView = false;
        this.selectedLinkType = false;
    }

    createLinkObject(workItemId: string, linkWorkItemId: string, linkId: string, linkType: string) : void {
      this.link = {
          // id: '',
          'type': 'workitemlinks',
          'attributes': {
            'version': 0
          },
          'relationships': {
            'link_type': {
              'data': {
                'id': linkId,
                'type': 'workitemlinktypes'
              }
            },
          'source': {
            'data': {
              'id': linkType == 'forward' ? workItemId : linkWorkItemId,
              'type': 'workitems'
            }
          },
          'target': {
            'data': {
              'id': linkType == 'reverse' ? workItemId : linkWorkItemId,
              'type': 'workitems'
            }
          }
        }
      };
    }

    onSelectItem(item: Object): void{
        if ( item ) {
            this.selectedWorkItem = item;
        }
        
    }

    onSelectRelation(relation: MinimizedLinkType): void{
        this.selectedLinkType = relation;
        // this.searchWorkItem.searchType = relation.relationships.target_type.data.id;
    }

    createLink(event: any | null = null): void {
        this.createLinkObject(
           this.workItem['id'], 
           this.selectedWorkItem['id'], 
           this.selectedLinkType.linkId, 
           this.selectedLinkType.linkType
          );
        const params = {'data': this.link};
        this.workItemService
        .createLink(params, this.workItem['id'])
        .then((response: any) => {
          this.selectedLinkType = false;
          this.selectedWorkItem = null;
        })
        .catch ((error: any) => console.log(error));
    }

    // deleteLink(link : Link){
    deleteLink(event: any, link : any, currentWorkItem: WorkItem): void{
      event.stopPropagation();
      this.workItemService
      .deleteLink(link, currentWorkItem.id)
      .then((response: any) => {
        if (!this.workItem.relationalData.totalLinkCount) {
          this.showLinkView = false;
        }
      })
      .catch ((error: any) => console.log(error));
    }

    loadLinkTypes(): void {
        this.workItemService
        .getLinkTypes()
        .then((linkTypes: LinkType[]) => {
          this.linkTypes = cloneDeep(linkTypes)
        })
        .catch ((e) => console.log(e));
    }

    toggleLinkComponent(): void{
      if (this.loggedIn) {
        this.showLinkComponent = !this.showLinkComponent;        
      }
    }

    toggleLinkView(): void{
        this.showLinkView = !this.showLinkView;
    }

    toggleLinkCreator(): void {
        this.showLinkCreator = !this.showLinkCreator;
    }

    onDetail(links: Link, workItem: WorkItem): void {
        let workItemId = links['relationships']['target']['data']['id'];
        if (links['relationships']['target']['data']['id'] == workItem['id']){
            workItemId = links['relationships']['source']['data']['id'];
        }
        this.router.navigate(['/work-item-list/detail/' + workItemId]);
    }
}