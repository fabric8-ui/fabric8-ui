import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';


@Component({
  selector: 'alm-backlog',
  templateUrl: 'backlog.component.html',
  styleUrls: ['./backlog.component.scss']
})
export class BacklogComponent implements OnInit {

  constructor(
    private router: Router) {
  }

  ngOnInit() {
    
  }

}
