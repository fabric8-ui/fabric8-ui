import { Router, ActivatedRoute } from '@angular/router';
import { Component, EventEmitter, OnInit, Output, ViewEncapsulation, AfterViewInit } from '@angular/core';

import { Codebase } from '../services/codebase';
import { CodebasesService } from '../services/codebases.service';
import { Logger, Broadcaster } from 'ngx-base';
import { Context, Contexts } from 'ngx-fabric8-wit';
import { trimEnd } from 'lodash'; 

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'codebases-create',
  templateUrl: './codebases-create.component.html',
  styleUrls: ['./codebases-create.component.scss'],
  providers: [CodebasesService]
})
export class CodebasesCreateComponent implements OnInit, AfterViewInit {
  @Output('onCreate') onCreate = new EventEmitter();

  context: Context;
  gitHubRepo: string;
  panelState: string = 'out';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private codebasesService: CodebasesService,
    private contexts: Contexts,
    private logger: Logger,
    private broadcaster: Broadcaster) {
    this.contexts.current.subscribe(val => this.context = val);
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    // Open the panel
    // Why use a setTimeOut -
    // This is for unit testing.
    // After every round of change detection,
    // dev mode immediately performs a second round to verify
    // that no bindings have changed since the end of the first,
    // as this would indicate that changes are being caused by change detection itself.
    // I had to triggers another round of change detection
    // during that method - emit an event, whatever. Wrapping it in a timeout would do the job
    setTimeout(() => {
      this.panelState = 'in';
    });
  }

  create($event: MouseEvent): void {
    if (this.gitHubRepo === undefined || this.gitHubRepo.trim().length === 0) {
      return;
    }
    let codebase = this.createTransientCodebase();
    this.codebasesService.create(this.context.space.id, codebase).subscribe(codebase => {
      this.onCreate.emit(codebase);
      this.close();
    });
  }

  createTransientCodebase(): Codebase {
    return {
      attributes: {
        type: 'git',
        url: this.gitHubRepo
      },
      type: 'codebases'
    } as Codebase;
  }

  togglePanelState($event: any): void {
    if ($event === 'out') {
      this.close();
    }
  }

  close() {
    // Wait for the animation to finish
    // From in to out it takes 300 ms
    // So wait for 400 ms
    setTimeout(() => {
      // TODO HACK setting the outlets: { overlay: null } as documented won't work for me so manually change the URL
      this.router.navigateByUrl(trimEnd(this.router.url.replace(/\(overlay:[a-z-]*\)/, ''), '/'));
    }, 400);
  }

}
