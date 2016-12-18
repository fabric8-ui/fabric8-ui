import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';


@Component({
  selector: 'alm-spaces',
  templateUrl: 'spaces.component.html',
  styleUrls: ['./spaces.component.scss']
})
export class SpacesComponent implements OnInit {

  constructor(
    private router: Router) {
  }

  ngOnInit() {
    
  }

}
