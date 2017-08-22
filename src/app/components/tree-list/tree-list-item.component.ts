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
  OnChanges
} from '@angular/core';

/**
 * Tree List Item Component - An expandable tree list item.
 */
@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'tree-list-item',
  templateUrl: './tree-list-item.component.html',
  styleUrls: ['./tree-list-item.component.less'],
})
export class TreeListItemComponent implements OnInit, OnChanges {

  @Input() itemTemplate: TemplateRef<any>;
  @Input('node') node: any;

  //@Output('onSelect') onSelect: EventEmitter<TreeListItemComponent> = new EventEmitter<TreeListItemComponent>();

  @ViewChild('target', {read: ViewContainerRef}) target: ViewContainerRef;

  private selected: boolean = false;

  constructor() {}

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }

  ngOnChanges(changes) {
  }

  getNode(): any {
    return this.node;
  }

  onSelect(event: MouseEvent): void {
    event.stopPropagation();
    console.log("################# ONSELECT 11")
    //this.onSelect.emit(this);
  }

  setSelected(select: boolean): void {
    this.selected = select;
  }

  isSelected(): boolean {
    return this.selected;
  }
}
