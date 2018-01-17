import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { LabelsComponent } from './label.component';

//ngrx stuff
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { LabelState, initialState as initialLabelState } from './../../states/label.state';
import { LabelReducer } from './../../reducers/label.reducer';
import { LabelEffects } from './../../effects/label.effects';

@NgModule({
  imports: [
    BsDropdownModule,
    CommonModule,
    RouterModule,
    StoreModule.forFeature('listPage', {
        labels: LabelReducer
     },{
          initialState: {
              labels: initialLabelState
            }
        }
    ),
    EffectsModule.forFeature([
        LabelEffects
    ])
  ],
  declarations: [
    LabelsComponent
  ],
  providers: [BsDropdownConfig],
  exports: [LabelsComponent]
})

export class LabelsModule { }
