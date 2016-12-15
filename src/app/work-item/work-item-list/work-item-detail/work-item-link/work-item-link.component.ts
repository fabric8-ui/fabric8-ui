import { Component, OnInit, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
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
    @ViewChild('searchBox') searchBox: any;
    @ViewChild('searchResultList') searchResultList: any; 

    linkTypes : LinkType[];
    link: Object;
    selectedWorkItem: Object = {};
    selectedLinkType: any = false;
    searchWorkItem : SearchData;
    selectedWorkItemId: string;
    selectedValue: string;
    searchWorkItems: WorkItem[] = [];
    showLinkComponent: Boolean = false;
    showLinkView: Boolean = false;
    showLinkCreator: Boolean = true;
    // showLinksList : Boolean = false;
    constructor (
        private workItemService: WorkItemService,
        private router: Router,
        http: Http
    ){}

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
    
    linkSearchWorkItem(term: any, event: any) {
        if(term.length >= 3){
            this.workItemService.searchLinkWorkItem(term)
                .then((searchData: WorkItem[]) =>{
                    this.searchWorkItems = searchData;
                    //console.log(searchData);
                });
        }
        else if(!term){
            this.searchWorkItems = [];
            this.selectedWorkItemId = '';
        }
        //console.log(this.searchResultList.nativeElement.children.length);
        if(event.keyCode == 40 || event.keyCode == 38){
            let lis = this.searchResultList.nativeElement.children;
            let i = 0;
            for (; i < lis.length; i++) {
                if (lis[i].classList.contains('selected')) {
                break;
                }
            }
            console.log(i);
            if (i == lis.length) { // No existing selected
                if (event.keyCode == 40) { // Down arrow
                    lis[0].classList.add('selected');
                    lis[0].scrollIntoView(false);
                } else { // Up arrow
                    lis[lis.length - 1].classList.add('selected');
                    lis[lis.length - 1].scrollIntoView(false);
                }
                console.log('in lis.length');
            } else { // Existing selected
                lis[i].classList.remove('selected');
                if (event.keyCode == 40) { // Down arrow
                    lis[(i + 1) % lis.length].classList.add('selected');
                    lis[(i + 1) % lis.length].scrollIntoView(false);
                } else { // Down arrow
                    // In javascript mod gives exact mod for negative value 
                    // For example, -1 % 6 = -1 but I need, -1 % 6 = 5
                    // To get the round positive value I am adding the divisor
                    // with the negative dividend
                    lis[(((i - 1) % lis.length) + lis.length) % lis.length].classList.add('selected');
                    lis[(((i - 1) % lis.length) + lis.length) % lis.length].scrollIntoView(false);
                }
                console.log('in else');
            }
        }
    }

    selectSearchResult(id: string, title: string){
        this.selectedWorkItemId = id;
        this.selectedValue = id+' - '+title;
        this.searchWorkItems = [];
    }
}