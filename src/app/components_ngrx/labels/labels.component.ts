import { cloneDeep } from 'lodash';
import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { LabelModel, LabelUI } from './../../models/label.model';
import { ActivatedRoute } from '@angular/router';
import { FilterService } from './../../services/filter.service';
@Component({
  selector: 'f8-label',
  templateUrl: './labels.component.html',
  styleUrls: ['./labels.component.less']
})

export class LabelsComponent {
  private _labels: LabelUI[] = [];

  @Input('labels') set labelInput(labels: LabelUI[]) {
    this._labels = labels.filter(label => {
      return label.backgroundColor &&
      label.textColor
    })
  };
  @Input() truncateAfter: number;
  @Input() allowDelete: boolean;
  @Input() context: string = '';
  @Output() onLabelClick = new EventEmitter();
  @Output() onRemoveLabel = new EventEmitter();

  private labels: LabelUI[] = [];
  private showMore: boolean = false;
  private queryParams: any;

  constructor(
    private route: ActivatedRoute,
    private filterService: FilterService
  ) {}

  moreClick(event) {
    event.stopPropagation();
  }

  clickLabel(label, event) {
    event.stopPropagation();
    this.onLabelClick.emit(label);
  }

  removeLabel(label, event) {
    event.stopPropagation();
    this.onRemoveLabel.emit(label);
  } 
  
  constructQueryExpression(labelId) { 
   this.queryParams = cloneDeep(this.route.snapshot.queryParams);
   let showTree: boolean = this.queryParams.hasOwnProperty('showTree');
   let showCompleted: boolean = this.queryParams.hasOwnProperty('showCompleted');
   const newQuery = this.filterService.queryBuilder(
      'label',
      this.filterService.equal_notation,
      labelId
    );
    let existingQuery = {};
    if (this.queryParams.hasOwnProperty('q')) {
      existingQuery = this.filterService.queryToJson(this.queryParams['q']);
    }
    const finalQuery = this.filterService.jsonToQuery(
      this.filterService.queryJoiner(
        existingQuery,
        this.filterService.and_notation,
        newQuery
      )
    );
    this.queryParams['q'] = finalQuery;
    return this.queryParams;
  }
}
