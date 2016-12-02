import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Http } from '@angular/http';
import { LinkType } from '../../../../models/link-type';
import { Link } from '../../../../models/link';
import { WorkItemLinkService } from './work-item-link.service';
import { WorkItem } from '../../../work-item';
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
    workitemLinks: Link[] = [];
    workItemsMap: Object = {};
    selectedWorkItem: Object = {};
    selectedLinkType: LinkType;
    searchWorkItem : SearchData;
    showLinkComponent: Boolean = false;
    showLinkView: Boolean = false;
    showLinkCreator: Boolean = true;
    //HACKS refactoring needed
    totalLinks: number = 0;
    linksGroupCount: Object = {};
    // showLinksList : Boolean = false;
    constructor (
        private WorkItemLinkService: WorkItemLinkService,
        private workItemService: WorkItemService,
        private router: Router,
        http: Http
    ){
        this.searchWorkItem = new SearchData(http);
    }

    ngOnInit() {
        this.loadLinkTypes();
        this.loadAllLinks();
    }

    ngOnChanges(changes: SimpleChanges){
        this.loadLinkTypes();
        this.loadAllLinks();
    }
    createLinkObject(sourceId: string, targetId: string, linkId: string) : void {
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
                        'id': sourceId,
                        'type': 'workitems'
                    }
                },
                'target': {
                    'data': {
                        'id': targetId,
                        'type': 'workitems'
                    }
                }
            }
        };
        // return link;
    }

    onSelectItem(item: Object): void{
        if ( item ) {
            this.selectedWorkItem = item;
        }
        
    }

    onSelectRelation(relation: LinkType): void{
        this.selectedLinkType = relation;
        this.searchWorkItem.searchType = relation.relationships.target_type.data.id;
    }

    createLink(event: any = null): void {
         this.createLinkObject(this.workItem['id'], this.selectedWorkItem['id'], this.selectedLinkType['id']);
         const tempValue = {'data': this.link};
         this.WorkItemLinkService
        .createLink(tempValue)
        .then(response => {
          this.workitemLinks.push(response);
          this.calculateTotal();
        }).catch((error) => {
            console.log(error);
        });
    }

    // deleteLink(link : Link){
    deleteLink(link : any): void{
         this.WorkItemLinkService
        .deleteLink(link)
        .then(response => {
          this.workitemLinks.forEach((item, index) => {
              if (item['id'] === link['id']) {
                  this.workitemLinks.splice(index, 1);
                  this.calculateTotal();
              }
          });
        }).catch((error) => {
            console.log(error);
        });
    }

    loadLinkTypes(): void {
        this.WorkItemLinkService
        .getLinkTypes()
        .then((lTypes) => {
            this.linkTypes = lTypes;
            this.selectedLinkType = lTypes[0];
            this.searchWorkItem.searchType = lTypes[0].relationships.target_type.data.id;
        }).catch(() => {
            console.log('Error in loading Link Types');
        });
    }
    
    loadAllLinks(): void{
        this.WorkItemLinkService
        .getAllLinks()
        .then((links) => {
            this.workitemLinks = links;
        }).catch(() => {
            console.log('Error in loading Links');
        });

        this.workItemService
        .getWorkItems()
        .then((wItems) => {
            wItems.forEach((item) => {
                this.workItemsMap[item.id] = item;
            });
            this.calculateTotal();
        });
    }

    calculateTotal(): void{
        this.linksGroupCount = {};
        this.totalLinks = 0;
        for ( var i = 0; i < this.workitemLinks.length; i++ ) {
            const linkObj = this.workitemLinks[i];
            if(this.showWorkItem(linkObj, this.workItem)){
                this.updateCount(linkObj);
            }
        }
    }

    updateCount(link: Link) {
        const linkTypeId = link['relationships']['link_type']['data']['id'];
        this.totalLinks = this.totalLinks + 1;
        if (!this.linksGroupCount.hasOwnProperty(linkTypeId)) {
            this.linksGroupCount[linkTypeId] = 1;
        } else {
            this.linksGroupCount[linkTypeId] = this.linksGroupCount[linkTypeId] + 1;
        }
    }

    toggleLinkComponent(): void{
        this.showLinkComponent = !this.showLinkComponent;
    }

    toggleLinkView(): void{
        this.showLinkView = !this.showLinkView;
    }

    toggleLinkCreator(): void {
        this.showLinkCreator = !this.showLinkCreator;
    }

    onDetail(links: Link, workItem: WorkItem): void {
        let workItemId = links['relationships']['target']['data']['id'];
        if(links['relationships']['target']['data']['id'] == workItem['id']){
            workItemId = links['relationships']['source']['data']['id'];
        }
        this.router.navigate(['/work-item-list/detail/' + workItemId]);
    }

    showWorkItem(link: Link, workItem: WorkItem) {
        const sourceId = link['relationships']['source']['data']['id'];
        const targetId = link['relationships']['target']['data']['id'];
        if (this.workItem['id'] == sourceId && this.workItemsMap[targetId]) {
            return true;
        } else if (this.workItem['id'] == targetId && this.workItemsMap[sourceId]) {
            return true;
        } else {
            return false;
        }
    }

}