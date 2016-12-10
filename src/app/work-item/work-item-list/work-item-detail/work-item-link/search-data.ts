import { Http, Response } from '@angular/http';
import { Subject } from 'rxjs/Subject';
import { WorkItem } from '../../../../models/work-item';

import { CompleterItem, CompleterData } from 'ng2-completer';

export class SearchData extends Subject<CompleterItem[]> implements CompleterData {
   private searchUrl = process.env.API_URL + 'search?q=';
   searchType : string = '';
   constructor(private http: Http) {
      super();
   }
   public search(term: string): void {
       let searchTerm = term;
       if ( this.searchType ){
           searchTerm = term + '+type:' + this.searchType;
       }
       this.http.get(this.searchUrl + searchTerm)
            .map((res: Response) => {
                // Convert the result to CompleterItem[]
                let workItems: WorkItem[] = res.json().data as WorkItem[];
                let matches: CompleterItem[] = workItems.map((workItem: WorkItem) => {
                    return {
                        title: workItem.attributes['system.title'],
                        id: workItem.id,
                        originalObject: workItem
                    };
                }) as CompleterItem[];
                this.next(matches);
           })
           .subscribe();
   }

 public cancel() {
     // Handle cancel
 }
}