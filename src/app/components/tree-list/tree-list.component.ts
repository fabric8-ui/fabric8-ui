import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
  ViewContainerRef,
  OnChanges,
  HostListener
} from '@angular/core';

/**
 * Tree List Component - An expandable tree list.
 */
@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'tree-list',
  templateUrl: './tree-list.component.html',
  styleUrls: ['./tree-list.component.less'],
})
export class TreeListComponent implements OnInit, OnChanges {

  @Input() listTemplate: TemplateRef<any>;
  @Input('nodes') nodes: any[];

  @Output('onLoadNodes') onLoadNodes = new EventEmitter();
  @Output('onLoadMoreNodes') onLoadMoreNodes = new EventEmitter();

  @ViewChild('target', {read: ViewContainerRef}) target: ViewContainerRef;

  currentNumberOfNodes: number = 0;

  constructor() {}

  // track scrolling to send onLoadMoreNodes event when
  // we're hitting the bottom of the scroll area.
  @HostListener('scroll', ['$event'])
  onScroll(event) {
    let tracker = event.target;
    let limit = tracker.scrollHeight - tracker.clientHeight;
    if (event.target.scrollTop === limit) {
      this.onLoadMoreNodes.emit();
    }
  }

  ngOnInit(): void {
    // load initial set of nodes.
    this.onLoadNodes.emit({ pageSize: 20 });
  }

  ngAfterViewInit(): void {
  }

  ngOnChanges(changes) {
    if (changes && changes.nodes) {
      this.updateTree();
    }
  }

  itemSelected($event) {
    console.log("########## SELECTED");
    console.log($event);
    // WorkItemListEntryComponent
  }

  updateTree() {
    if (this.nodes && (this.nodes.length>this.currentNumberOfNodes)) {
      for (var i=this.currentNumberOfNodes; i<this.nodes.length; i++) {
        this.target.createEmbeddedView(this.listTemplate, { node: this.nodes[i] });
        this.currentNumberOfNodes++;
      }
    }
  }
}
