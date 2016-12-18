import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';


@Component({
  selector: 'alm-analyzeOverview',
  templateUrl: 'analyze-overview.component.html',
  styleUrls: ['./analyze-overview.component.scss']
})
export class AnalyzeOverviewComponent implements OnInit {

  imgLoaded: Boolean = false;


  constructor(
    private router: Router) {
  }

  ngOnInit() {

  }

  onImgLoad() {
    this.imgLoaded = true;
  }

}
