import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DummyService } from '../dummy/dummy.service';
import { Space } from '../models/space';
import { ProcessTemplate } from '../models/process-template';


@Component({
  selector: 'space-dialog',
  templateUrl: './space-dialog.component.html',
  styleUrls: ['./space-dialog.component.scss']
})
export class SpaceDialogComponent {

  newSpace: Space;

  constructor(
    private router: Router,
    public dummy: DummyService) {
      this.resetNewSpace();
  }

  createSpace() {
    console.log(this.newSpace);
    // TODO: Once we have dynamic routing, fix this
    this.newSpace.path = '/pmuir/BalloonPopGame';
    this.newSpace.description = this.newSpace.name;
    this.dummy.spaces.push(this.newSpace);
    this.dummy.save();
    this.router.navigate([this.newSpace.path]);
    this.resetNewSpace();
  }

  private resetNewSpace(): void {
    this.newSpace = new Space();
    this.newSpace.process = this.dummy.processTemplates[0];
    this.newSpace.private = false;
  }

}
