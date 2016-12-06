import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';


@Component({
  selector: 'alm-hypothesis',
  templateUrl: './hypothesis.component.html',
  styleUrls: ['./hypothesis.component.scss']
})
export class HypothesisComponent implements OnInit {

  constructor(
    private router: Router) {
  }

  ngOnInit() {
    
  }

}
