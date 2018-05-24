import {
  Component,
  Input,
  OnInit,
  Output,
  ViewChild,
  ElementRef,
  EventEmitter
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Space } from 'ngx-fabric8-wit';
import { WorkItemUI, WorkItem } from './../../models/work-item';
import { WorkItemLinkUI } from './../../models/link';
import { LinkTypeUI } from './../../models/link-type';
import { Observable } from 'rxjs/Observable';

import { WorkItemService } from '../../services/work-item.service';

//ngrx stuff
import { AppState } from './../../states/app.state';
import { Store } from '@ngrx/store';
import * as LinkTypeActions from './../../actions/link-type.actions';
import * as WorkItemLinkActions from './../../actions/work-item-link.actions';

@Component({
  selector: 'work-item-link',
  templateUrl: './work-item-link.component.html',
  styleUrls: ['./work-item-link.component.less']
})

export class WorkItemLinkComponent implements OnInit {
  @Input() loggedIn: Boolean;
  @Input() detailContext: string; // It should be detail or preview
  @Output() onLinkClick = new EventEmitter();
  @ViewChild('searchResultList') searchResultList: any;
  @ViewChild('linkTypeSelector') linkTypeSelector: ElementRef;
  @ViewChild('wiSearchBox') wiSearchBox: ElementRef;

  @Input('workItem') set workItemSetter(workItem: WorkItemUI) {
    this.workItem = workItem;
    this.store.dispatch(
      new WorkItemLinkActions.Get(this.workItem.link+'/relationships/links')
    );
    this.setSearchNotAllowedIds();
  }

  private workItem: WorkItemUI = null;
  private eventListeners: any[] = [];
  private linkTypes: LinkTypeUI[] = [];
  private workItemLinks: WorkItemLinkUI[] = [];
  private showLinkComponent: Boolean = false;
  private selectedTab: string | null = null;
  private showLinkView: Boolean = false;
  private showLinkCreator: Boolean = true;
  private selectedLinkType: LinkTypeUI = null;
  searchWorkItems: WorkItem[] = [];
  searchNotAllowedIds: string[] = [];
  selectedWorkItemId: string;
  selectedValue: string = '';

  private spaceSource = this.store
    .select('listPage')
    .select('space')
    .filter(s => !!s);
  private linkTypeSource = this.store
    .select('detailPage')
    .select('linkType')
    .filter(lt => !!lt.length);
  private workItemLinkSource = this.store
    .select('detailPage')
    .select('workItemLink');

  constructor(
    private store: Store<AppState>,
    private workItemService: WorkItemService,
    private router: Router
  ){}

  ngOnInit() {
    this.eventListeners.push(
      this.spaceSource.take(1)
        .subscribe((space: Space) => {
          this.store.dispatch(new LinkTypeActions.Get());
        })
    );

    Observable.combineLatest(
      this.spaceSource,
      this.linkTypeSource
    ).take(1).subscribe(([
      spaceSource,
      linkTypeSource
    ]) => {
      this.linkTypes = [...linkTypeSource];
      this.workItemLinkSource.subscribe(workItemLinks => {
        this.workItemLinks = [...workItemLinks];
        if (this.linkTypeSelector && this.wiSearchBox) {
          this.wiSearchBox.nativeElement.value = '';
        }
      });
    })
  }

  toggleLinkComponent(onlyOpen: Boolean = false) {
    if (this.loggedIn) {
      if (onlyOpen) {
        this.showLinkComponent = true;
      } else {
        this.showLinkComponent = !this.showLinkComponent;
      }
    }
    if (!this.showLinkComponent) {
      this.selectedTab = null;
    } else {
      if (!this.selectedTab) {
        this.selectedTab = 'all';
      }
    }
  }

  selectTab(linkTypeName: string | null = null) {
    this.selectedTab = linkTypeName;
    this.toggleLinkComponent(true);
  }

  toggleLinkView() {
    this.showLinkView = !this.showLinkView;
  }

  toggleLinkCreator() {
    this.showLinkCreator = !this.showLinkCreator;
  }

  onSelectRelation(relation: any): void{
    //clear the search box and reset values related to search
    this.wiSearchBox.nativeElement.value = '';
    this.searchWorkItems = [];
    this.selectedWorkItemId = null;
    this.selectedLinkType = relation;
  }

  setSearchNotAllowedIds() {
    this.searchNotAllowedIds.push(this.workItem.id);
  }

  selectSearchResult(id: string, number: number, title: string){
    this.selectedWorkItemId = id;
    this.selectedValue = number + ' - ' + title;
    this.searchWorkItems = [];
  }

  searchWorkItem(term, event) {
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
          let selectedNumber = lis[i].dataset.winumber;
          let selectedTitle = lis[i].dataset.wititle;
          this.selectSearchResult(selectedId, selectedNumber, selectedTitle);
        }
    } else { // Normal case - search on type
      if (term.trim() != "") {
      // Search on atleast 3 char or numeric
        if (term.length >= 3 || !isNaN(term)) {
          this.workItemService.searchLinkWorkItem(term)
            .subscribe((searchData: WorkItem[]) => {
              this.searchWorkItems = searchData.filter((item) => {
                return this.searchNotAllowedIds.indexOf(item.id) == -1;
              });
            }, err => console.log(err));
        }
      }
      else {
        // Reseting search data
        this.searchWorkItems = [];
        if (this.selectedWorkItemId) {
          // this.resetSearchData();
        }
      }
    }
  }

  createLink(link) {
    let linkPayload = this.createLinkObject(
      this.workItem.id,
      this.selectedWorkItemId,
      this.selectedLinkType.id,
      this.selectedLinkType.linkType
    );
    this.store.dispatch(new WorkItemLinkActions.Add(linkPayload));
  }

  deleteLink(event, wiLink, workItem) {
    this.store.dispatch(new WorkItemLinkActions.Delete({
      wiLink: wiLink,
      workItemId: workItem.id
    }));
  }

  createRouterLink(wiNumber, detailContext) {
    if (detailContext === "detail") {
      let url = this.router.url.split('detail');
      url[url.length-1] = 'detail/' + wiNumber;
      return url.join("");
    }
  }

  onLinkClicked(wiNumber) {
    this.onLinkClick.emit({
      number: wiNumber
    });
  }

  createLinkObject(sourceId: string, targetId: string, linkId: string, linkType: string) {
    return {
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
            'id': linkType === 'forward' ? sourceId : targetId,
            'type': 'workitems'
          }
        },
        'target': {
          'data': {
            'id': linkType === 'reverse' ? sourceId : targetId,
            'type': 'workitems'
          }
        }
      },
      'type': 'workitemlinks'
    };
  }
}
