import { 
	Component, 
	OnInit, 
	Input 
} from '@angular/core';

import { WorkItem } from './../work-item/work-item';
import { WorkItemService } from '../work-item/work-item.service';

@Component({
	selector: 'status-drawer',
	templateUrl: './status-drawer.component.html',
	styleUrls: ['./status-drawer.component.css'],
})
export class StatusDrawerComponent implements OnInit{
	@Input() workItem: WorkItem;
	show: boolean = false;

	constructor(
		private workItemService: WorkItemService) {
	}
	
	ngOnInit(): void {
		if(!this.workItem.fields['system.state']){
			this.workItem.statusCode = 0;
			this.workItem.fields['system.state'] = "new";
		} else {
			var state = this.workItem.fields['system.state']
			var status = 0
			switch(state) {
				case 'new':
					status = 0;
					break;
				case 'in progress':
					status = 1;
					break;
				case 'resolved':
					status = 2;
					break;
				case 'closed':
					status = 3;
					break;
			}
			this.workItem.statusCode = status;
		}
  	}

	onDrawerToggle(): void {
		this.show = !this.show;
	}

	changeStatus(code: number, status: string): void {
		this.workItem.statusCode = code;
		this.workItem.fields['system.state'] = status
		this.workItemService.update(this.workItem)
		this.onDrawerToggle();
	}
}
