import { cloneDeep } from 'lodash';
import {
  Component,
  EventEmitter,
  OnInit,
  Input,
  Output,
  SimpleChanges
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { FilterService } from '../../services/filter.service';
import { Space, Spaces } from 'ngx-fabric8-wit';
import { User } from 'ngx-login-client';
import { LabelModel, LabelUI } from './../../models/label.model';

//ngrx stuff
import { Store } from '@ngrx/store';
import { AppState } from './../../states/app.state';
import * as LabelActions from './../../actions/label.actions';

@Component({
    selector: 'f8-label',
    templateUrl: './labels.component.html',
    styleUrls: ['./labels.component.less']
})

export class LabelsComponent implements OnInit {
    private _labels: LabelUI[] = [];

    @Input('labels') set labelInput(labels: LabelUI[]) {
        this._labels = labels.filter(label => {
            return label.backgroundColor &&
            label.textColor
        })
    };

    @Input() truncateAfter: number;
    @Input() allowDelete: boolean;
    @Output() onLabelClick = new EventEmitter();
    @Output() onRemoveLabel = new EventEmitter();

    private labels: LabelUI[] = [];
    private showMore: boolean = false;
    private spaceId;

    constructor(
        private filterService: FilterService,
        private spaces: Spaces,
        private store: Store<AppState>
    ) {}

    ngOnInit() {
        const spaceData = this.store
       .select('listPage')
       .select('space')
       .filter(space => space !== null)

       spaceData.subscribe(space => this.spaceId = space.id);
    }

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
}
