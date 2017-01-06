import { ContextService } from './../../shared/context.service';
import { UserService } from './../../user/user.service';
import { DummyService } from './../../dummy/dummy.service';
import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';


@Component({
  selector: 'alm-overview',
  templateUrl: 'overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  constructor(
    private router: Router, public dummy: DummyService, public context: ContextService) {
  }

  ngOnInit() {

  }

}
