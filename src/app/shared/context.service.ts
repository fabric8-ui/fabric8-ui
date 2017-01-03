import { Injectable } from '@angular/core';
import { ContextMenuItem } from './../models/context-menu-item';
import { DummyService } from './../dummy/dummy.service';
import { Router } from '@angular/router';
import { Broadcaster } from '../shared/broadcaster.service';


/*
 * A shared service that manages the users current context. The users context is defined as the
 * entity (user or org) and space that they are operating on.
 * 
 */
@Injectable()
export class Context {

    public current: ContextMenuItem;

    constructor(
        private dummy: DummyService,
        private router: Router,
        private broadcaster: Broadcaster
    ) {
        // Listen for any context refreshes requested by the app
        this.broadcaster.on<string>('refreshContext').subscribe(message => {
            this.computeContext();
        });
        // Compute the initial context
        this.computeContext();
    }

    private computeContext() {
        // Find the most specific context menu path and display it
        // TODO This is brittle
        let defaultItem;
        let c;
        for (let m of this.dummy.contextMenuItems) {
            if (this.router.url.startsWith(m.path)) {
                if (c == null || m.path.length > c.path.length) {
                    c = m;
                }
            }
            if (m.default) {
                defaultItem = m;
            }
        }
        // Always make a copy, as this value as we're going to insert items in to the source data
        this.current = JSON.parse(JSON.stringify(c || defaultItem));
        if (this.current.type.menus) {
            for (let n of this.current.type.menus) {
                n.fullPath = this.buildPath(this.current.path, n.path);
                if (n.menus) {
                    for (let o of n.menus) {
                        o.fullPath = this.buildPath(this.current.path, n.path, o.path);
                        if (o.fullPath === this.router.url) {
                            o.active = true;
                            n.active = true;
                        }
                    }
                } else if (n.fullPath === this.router.url) {
                    n.active = true;
                }
            }
        }
    }

    private buildPath(...args: string[]): string {
        let res = '';
        for (let p of args) {
            if (p.startsWith('/')) {
                res = p;
            } else {
                res = res + '/' + p;
            }
            res = res.replace(/\/*$/, '');
        }
        return res;
    }

}
