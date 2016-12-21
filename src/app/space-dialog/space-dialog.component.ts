import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';
import { DummyService } from '../dummy/dummy.service';


@Component({
  selector: 'space-dialog',
  templateUrl: './space-dialog.component.html',
  styleUrls: ['./space-dialog.component.scss']
})
export class SpaceDialogComponent {

  constructor(
    private router: Router,
    public dummy: DummyService ) {
  }

  createSpace() {
    this.router.navigate(['/pmuir/BalloonPopGame/analyze']);
  }

}
