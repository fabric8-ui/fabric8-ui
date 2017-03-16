import { Component, DoCheck, OnInit, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Http } from '@angular/http';
import { cloneDeep, trimEnd } from 'lodash';

import { Link } from './../../../models/link';
import { LinkDict } from './../../../models/work-item';
import { LinkType, MinimizedLinkType } from './../../../models/link-type';
import { WorkItem } from './../../../models/work-item';
import { WorkItemService } from './../../work-item.service';

import { SearchData } from './search-data';

@Component({
  selector: 'alm-work-item-link',
  templateUrl: './work-item-link.component.html',
  styleUrls: ['./work-item-link.component.scss'],
  // styles:['.completer-input {width:100%;float:left;};.completer-dropdown-holder {width:100%;float:left;}']
})
export class WorkItemLinkComponent implements OnInit, OnChanges, DoCheck {
  @Input() workItem: WorkItem;
  @Input() loggedIn: Boolean;
  @ViewChild('searchBox') searchBox: any;
  @ViewChild('searchResultList') searchResultList: any;

  linkTypes : any[] = [];
  link: Object;
  selectedWorkItem: Object = {};
  selectedLinkType: any = false;
  searchWorkItem : SearchData;
  selectedWorkItemId: string;
  selectedValue: string = '';
  searchWorkItems: WorkItem[] = [];
  showLinkComponent: Boolean = false;
  showLinkView: Boolean = false;
  showLinkCreator: Boolean = true;
  searchAllowedType: string = '';
  searchNotAllowedIds: string[] = [];
  prevWItem: WorkItem | null = null;
  selectedTab: string | null = null;
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
    this.resetSearchData();
  }

  ngDoCheck() {
    // To reset selected link type on change wi type
    if (this.prevWItem &&
        this.prevWItem.relationships.baseType.data.id
          !== this.workItem.relationships.baseType.data.id) {
      // Change in work item type
      // Reset selected link type
      this.selectedLinkType = false;
    }
    this.prevWItem = cloneDeep(this.workItem);
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

  onSelectRelation(relation: any): void{
    //clear the search box and reset values related to search
    this.searchBox.nativeElement.value = '';
    this.searchWorkItems = [];
    this.selectedWorkItemId = null;
    this.selectedLinkType = relation;
    this.searchAllowedType = relation.wiType;
    this.setSearchNotAllowedIds();
  }

  setSearchNotAllowedIds(): void {
    this.searchNotAllowedIds.push(this.workItem.id);
    let relatedLinks = this.workItem.relationalData.linkDicts.find(
      (item) => item.linkName == this.selectedLinkType.name
    );
    if (typeof(relatedLinks) !== 'undefined') {
      relatedLinks.links.forEach((item: Link) => {
        if (this.searchNotAllowedIds.indexOf(item.relationalData.source.id) === -1) {
          this.searchNotAllowedIds.push(item.relationalData.source.id);
        }
        if (this.searchNotAllowedIds.indexOf(item.relationalData.target.id) === -1) {
          this.searchNotAllowedIds.push(item.relationalData.target.id);
        }
      });
    }
    console.log('Your search results will not have ' + this.searchNotAllowedIds.join(', ')) + ' IDs';
  }

  createLink(event: any = null): void {
    this.createLinkObject(
       this.workItem.id,
       this.selectedWorkItemId,
       this.selectedLinkType.linkId,
       this.selectedLinkType.linkType
      );
    const tempValue = {'data': this.link};
    this.workItemService
      .createLink(tempValue, this.workItem['id'])
      .then((response: any) => {
        this.resetSearchData();
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
    .getLinkTypes(this.workItem)
      .then((linkTypes: Object) => {
        this.formatLinkTypes(linkTypes);
        // this.linkTypes = cloneDeep(linkTypes)
      })
      .catch ((e) => console.log(e));
  }

  formatLinkTypes(linkTypes: any): void {
    this.linkTypes = [];
    linkTypes.forwardLinks.forEach((linkType: LinkType) => {
      this.linkTypes.push({
          name: linkType.attributes['forward_name'],
          linkId: linkType.id,
          linkType: 'forward',
          wiType: linkType.relationships.target_type.data.id
        });
    });
    linkTypes.backwardLinks.forEach((linkType: LinkType) => {
      this.linkTypes.push({
          name: linkType.attributes['reverse_name'],
          linkId: linkType.id,
          linkType: 'reverse',
          wiType: linkType.relationships.source_type.data.id
        });
    });
  }

  toggleLinkComponent(onlyOpen: Boolean = false): void{
    if (this.loggedIn) {
      if (onlyOpen) {
        this.showLinkComponent = true;
      } else {
        this.showLinkComponent = !this.showLinkComponent;
      }
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
    this.router.navigateByUrl(trimEnd(this.router.url.split('detail')[0], '/') + '/detail/' + workItemId);
  }

  linkSearchWorkItem(term: any, event: any) {
    event.stopPropagation();
    //console.log(this.searchResultList.nativeElement.children.length);
    if (event.keyCode == 40 || event.keyCode == 38){
      let lis = this.searchResultList.nativeElement.children;
      let i = 0;
      for (; i < lis.length; i++) {
        if (lis[i].classList.contains('selected')) {
          break;
        }
      }
      if (i == lis.length) { // No existing selected
        if (event.keyCode == 40) { // Down arrow
          lis[0].classList.add('selected');
          lis[0].scrollIntoView(false);
        } else { // Up arrow
          lis[lis.length - 1].classList.add('selected');
          lis[lis.length - 1].scrollIntoView(false);
        }
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
      }
    } else if (event.keyCode == 13) { // Enter key event
        let lis = this.searchResultList.nativeElement.children;
        let i = 0;
        for (; i < lis.length; i++) {
          if (lis[i].classList.contains('selected')) {
            break;
          }
        }
        if (i < lis.length) {
          let selectedId = lis[i].dataset.wiid;
          let selectedTitle = lis[i].dataset.wititle;
          this.selectSearchResult(selectedId, selectedTitle);
        }
    } else { // Normal case - search on type
      if (term.trim() != "") {
      // Search on atleast 3 char or numeric
        if (term.length >= 3 || !isNaN(term)) {
          this.workItemService.searchLinkWorkItem(term, this.searchAllowedType)
            .then((searchData: WorkItem[]) =>{
              this.searchWorkItems = searchData.filter((item) => {
                return this.searchNotAllowedIds.indexOf(item.id) == -1;
                });
            });
        }
      }
      else {
        // Reseting search data
        this.searchWorkItems = [];
        if (this.selectedWorkItemId) {
          this.resetSearchData();
        }
      }
    }
  }

  resetSearchData() {
    this.selectedWorkItemId = null;
    this.selectedValue = '';
    this.selectedLinkType = false;
    this.searchNotAllowedIds = [];
  }

  selectSearchResult(id: string, title: string){
    this.selectedWorkItemId = id;
    this.selectedValue = id+' - '+title;
    this.searchWorkItems = [];
  }

  selectTab(linkTypeName: string | null = null) {
    this.selectedTab = linkTypeName;
    this.resetSearchData();
    this.toggleLinkComponent(true);
  }
}
