import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';


@Component({
  selector: 'side-panel',
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.scss']
})
export class SidepanelComponent implements OnInit {


  constructor(
    private router: Router) {
  }

  ngOnInit() {
  }

}
